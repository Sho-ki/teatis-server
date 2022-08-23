import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { Product } from '@Domains/Product';

export interface UpdateRecurringPractitionerBoxesUsecaseInterface {
  filterDuplicatePractitionerBox(
    allPractitionerBoxes: PractitionerBox[],
  ): Promise<ReturnValueType<PractitionerBox[]>>;
  swapTargetProducts(
    allPractitionerBoxes: PractitionerBox[],
    newProducts: {products: { sku: string }[]},
    allProducts: Product[]
  ): Promise<ReturnValueType<PractitionerBox[]>>;
  updateRecurringPractitionerBoxes(
    recurringPractitionerBoxes:PractitionerBox[],
  ): Promise<ReturnValueType<(Prisma.BatchPayload | PractitionerBox)[]>>;
}

@Injectable()
export class UpdateRecurringPractitionerBoxesUsecase
implements UpdateRecurringPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async filterDuplicatePractitionerBox(
    allPractitionerBoxes,
  ): Promise<ReturnValueType<PractitionerBox[]>> {
    const newestPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes.filter((value, index, self) =>
      index === self.findIndex(element => (
        value.practitionerId === element.practitionerId
      ))
    );
    return [newestPractitionerBoxes, undefined];
  }
  async swapTargetProducts(
    allPractitionerBoxes: PractitionerBox[],
    newProducts: {products: { sku: string }[]},
    allProducts: Product[],
  ): Promise<ReturnValueType<PractitionerBox[]>> {
    const targetPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes
      .filter(practitionerBox => {
        const isRecurring = practitionerBox.label.split('___')[0] === 'Recurring';
        return isRecurring && practitionerBox;
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
    for (let boxIndex = 0; boxIndex < targetPractitionerBoxes.length; ++boxIndex) {
      const targetProducts: Product[] = targetPractitionerBoxes[boxIndex].products;
      let targetProductsSku: string[] = targetProducts.map(targetProduct => targetProduct.sku);
      const duplicateProductsSku: string[] =
      targetProductsSku
        .filter(targetProductSku => chosenProductSkus.includes(targetProductSku));
      for (let productIndex = 0; productIndex < targetProducts.length; ++productIndex) {
        const currentProduct: Product = targetProducts[productIndex];
        if (!duplicateProductsSku.includes(currentProduct.sku)) continue;
        const duplicateProductCategory: string = currentProduct.sku.split('-')[1];
        let alreadyChosenProduct = true;
        let newProduct: Product;
        while (alreadyChosenProduct) {
          if (!productsByCategory[duplicateProductCategory].length) break;
          newProduct = productsByCategory[duplicateProductCategory].shift();
          if (targetProductsSku.includes(newProduct.sku)) continue;
          if (!chosenProductSkus.includes(newProduct.sku)) alreadyChosenProduct = false;
        }
        if (!alreadyChosenProduct) {
          targetProducts[productIndex] = {
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
  async updateRecurringPractitionerBoxes(
    recurringPractitionerBoxes: PractitionerBox[]
  ): Promise<ReturnValueType<(Prisma.BatchPayload | PractitionerBox)[]>>{
    const [updateRecurringPractitionerBoxes, updateRecurringPractitionerBoxesError] =
      await this.practitionerBoxRepository.updatePractitionerBoxes(recurringPractitionerBoxes);
    if (updateRecurringPractitionerBoxesError) return [undefined, updateRecurringPractitionerBoxesError];
    return [updateRecurringPractitionerBoxes, undefined];
  }
}
