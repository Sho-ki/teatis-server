import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { Product } from '@Domains/Product';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { UpsertRecurringPractitionerBoxDto } from '../../controllers/discoveries/dtos/upsertRecurringPractitionerBox';
import { nextMonth } from '../utils/dates';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerAndBox } from '../../domains/PractitionerAndBox';

export interface UpdateRecurringPractitionerBoxesUsecaseInterface {
  upsertRecurringPractitionerBoxes(
  { products, label }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerAndBox[]>>;
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

  private filterUpdatedPractitionerBoxes (
    allPractitionerBoxes: PractitionerBox[],
    label: string,
  ): [PractitionerBox[], PractitionerBox[]] {
    const updatedPractitionerBox: PractitionerBox[] = allPractitionerBoxes
      .filter(practitionerBox => practitionerBox.label.includes(label));
    const outdatedPractitionerBox: PractitionerBox[] = allPractitionerBoxes
      .filter(practitionerBox => !practitionerBox.label.includes(label));
    return [updatedPractitionerBox, outdatedPractitionerBox];
  }

  private filterDuplicatePractitionerBox (
    allPractitionerBoxes: PractitionerBox[],
  ): PractitionerBox[] {
    const newestPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes.filter((value, index, self) =>
      index === self.findIndex(element => (
        value.practitionerId === element.practitionerId
      ))
    );
    return newestPractitionerBoxes;
  }
  private swapTargetProducts(
    targetBox: PractitionerBox,
    newProducts: Product[], // teatis chosen 12 products
    allProducts: Product[],
  ): PractitionerBox {
    const targetProductsSku: string[] = targetBox.products.map(({ sku }:Product) => sku);
    const chosenProductsSku: string[] = newProducts.map(newProduct => newProduct.sku);
    const chooseableProducts: Product[] = allProducts.filter(product => {
      return ![...targetProductsSku, ...chosenProductsSku].includes(product.sku);
    });
    const newPractitionerBoxProducts: Product[] = [];
    for(const { id, sku, label, name } of newProducts){
      const duplicateProductIndex = targetBox.products.findIndex(
        product => product.sku === sku);
      if (duplicateProductIndex === -1) {
        newPractitionerBoxProducts.push({ id, name, label, sku });
        continue;
      }

      const categoryCode = sku.split('-')[1];
      let chooseableProductIndex = chooseableProducts.findIndex(({ sku }) => {
        return sku.split('-')[1] === categoryCode;
      });
      if(chooseableProductIndex === -1){
        chooseableProductIndex = 0;
      }
      const foundProduct = chooseableProducts[chooseableProductIndex];
      newPractitionerBoxProducts.push({
        id: foundProduct.id,
        name: foundProduct.name,
        label: foundProduct.label,
        sku: foundProduct.sku,
      });
      chooseableProducts.splice(chooseableProductIndex, 1);
    }

    targetBox.products = newPractitionerBoxProducts;
    return targetBox;
  }

  async upsertRecurringPractitionerBoxes (
    { products: newProductIds, label: targetBoxLabel }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerAndBox[]>>{
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
    const newestPractitionerBoxes = this.filterDuplicatePractitionerBox(allPractitionerBoxes);
    const [existingRecurringBoxes, newRecurringBoxes] =
      this.filterUpdatedPractitionerBoxes(newestPractitionerBoxes, targetBoxLabel);

    const newProducts:Product[] =
    allProducts.filter(({ id }) => newProductIds.find((val) => val.id === id));

    const upsertTarget = [...existingRecurringBoxes];
    for(const newRecurringBox of newRecurringBoxes){
      const uuid = uuidv4();
      newRecurringBox.uuid = uuid;
      newRecurringBox.label = `Recurring___${nextMonth()}___${newRecurringBox.label}`;
      upsertTarget.push(this.swapTargetProducts(newRecurringBox, newProducts, allProducts));
    }

    const [upsertPractitionerBox, upsertPractitionerBoxError] =
      await this.practitionerBoxRepository.performAtomicOperations(
        async (): Promise<ReturnValueType<PractitionerAndBox[]>> => {
          const resultList:PractitionerAndBox[] = [];
          for(const box of upsertTarget){
            const [upsertPractitionerBox, upsertPractitionerBoxError] =
            await this.practitionerBoxRepository.upsertPractitionerBox(box);
            if(upsertPractitionerBoxError){
              return [undefined, upsertPractitionerBoxError];
            }
            resultList.push(upsertPractitionerBox);
          }
          return [resultList];
        },
      );
    if (upsertPractitionerBoxError) {
      return [undefined, upsertPractitionerBoxError];
    }
    return [upsertPractitionerBox];

  }
}
