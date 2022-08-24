import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { Product } from '@Domains/Product';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';

export interface UpdateRecurringPractitionerBoxesUsecaseInterface {
  updateRecurringPractitionerBoxes(
    newProducts: {products: {sku: string}[]}
  ): Promise<ReturnValueType<(Prisma.BatchPayload | PractitionerBox)[]>>;
}

@Injectable()
export class UpdateRecurringPractitionerBoxesUsecase
implements UpdateRecurringPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
  ) {}
  private filterDuplicatePractitionerBox(
    allPractitionerBoxes,
  ): ReturnValueType<PractitionerBox[]> {
    const newestPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes.filter((value, index, self) =>
      index === self.findIndex(element => (
        value.practitionerId === element.practitionerId
      ))
    );
    return [newestPractitionerBoxes, undefined];
  }
  private swapTargetProducts(
    allPractitionerBoxes: PractitionerBox[],
    newProducts: {products: { sku: string }[]},
    allProducts: Product[],
  ): ReturnValueType<PractitionerBox[]> {
    const targetPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes
      .filter(practitionerBox => {
        return practitionerBox.label.split('___')[0] === 'Recurring';
      });
    const chosenProductSkus: string[] = newProducts.products.map(newProduct => newProduct.sku);
    const productsByCategory = {};
    allProducts.forEach(product => {
      const category = product.sku.split('-')[1];
      if(productsByCategory[category]) {
        productsByCategory[category].push(product);
      } else {
        productsByCategory[category] = [product];
      }
    });
    for (const targetPractitionerBox of targetPractitionerBoxes) {
      const targetProducts: Product[] = targetPractitionerBox.products;
      let targetProductsSku: string[] = targetProducts.map(targetProduct => targetProduct.sku);
      const duplicateProductsSku: string[] =
        targetProductsSku
          .filter(targetProductSku => chosenProductSkus.includes(targetProductSku));
      for (let targetProduct of targetProducts) {
        if (!duplicateProductsSku.includes(targetProduct.sku)) continue;
        const duplicateProductCategory: string = targetProduct.sku.split('-')[1];
        let alreadyChosenProduct = true;
        let newProduct: Product;
        while (alreadyChosenProduct) {
          if (!productsByCategory[duplicateProductCategory].length) break;
          newProduct = productsByCategory[duplicateProductCategory].shift();
          if (targetProductsSku.includes(newProduct.sku)) continue;
          if (!chosenProductSkus.includes(newProduct.sku)) alreadyChosenProduct = false;
        }
        if (!alreadyChosenProduct) {
          targetProduct = {
            id: newProduct.id,
            name: newProduct.name,
            label: newProduct.label,
            sku: newProduct.sku,
          };
          targetProductsSku = targetProducts.map(targetProduct => targetProduct.sku);
        }
      }
    }
    return [targetPractitionerBoxes, undefined];
  }
  async updateRecurringPractitionerBoxes (
    newProducts: {products: {sku: string}[]}
  ): Promise<ReturnValueType<(Prisma.BatchPayload | PractitionerBox)[]>>{
    const [allPractitionerBoxes, allPractitionerBoxesError] =
      await this.practitionerBoxRepository.getAllPractitionerBoxes();
    if (allPractitionerBoxesError) { [undefined, allPractitionerBoxesError]; }

    const [allProducts, allProductsError] =
      await this.productGeneralRepository.getAllProducts(
        {
          medicalConditions:
          {
            highBloodPressure: false,
            highCholesterol: false,
          },
        }
      );
    if (allProductsError) { [undefined, allProductsError]; }

    const [newestRecurringBoxes, newestRecurringBoxesError] =
      await this.filterDuplicatePractitionerBox(allPractitionerBoxes);
    if (newestRecurringBoxesError) { [undefined, newestRecurringBoxesError]; }

    const productsByCategory = {};
    allProducts.forEach(product => {
      const category = product.sku.split('-')[1];
      if(productsByCategory[category]) {
        productsByCategory[category].push(product);
      } else {
        productsByCategory[category] = [product];
      }
    });

    const [swapTargetProducts, swapTargetProductsError] =
      await this.swapTargetProducts(newestRecurringBoxes, newProducts, allProducts);
    if (swapTargetProductsError) { [undefined, swapTargetProductsError]; }

    const [updateRecurringPractitionerBoxes, updateRecurringPractitionerBoxesError] =
      await this.practitionerBoxRepository.updatePractitionerBoxes(swapTargetProducts);
    if (updateRecurringPractitionerBoxesError) return [undefined, updateRecurringPractitionerBoxesError];

    return [updateRecurringPractitionerBoxes, undefined];
  }
}
