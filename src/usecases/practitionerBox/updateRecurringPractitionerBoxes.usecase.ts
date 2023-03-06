import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { MasterMonthlyBoxRepositoryInterface } from '../../repositories/teatisDB/masterMonthlyBox/masterMonthlyBox.repository';
import { PractitionerAndBox } from '../../domains/PractitionerAndBox';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repository';
import { Product } from '@Domains/Product';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ReturnValueType } from '@Filters/customError';
import { TransactionOperatorInterface } from '@Repositories/utils/transactionOperator';
import { UpsertRecurringPractitionerBoxDto } from '../../controllers/discoveries/practitionerBox/dtos/upsertRecurringPractitionerBox';
import { nextMonth } from '@Usecases/utils/dates';

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
    private readonly practitionerBoxRepository: PractitionerBoxRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('MasterMonthlyBoxRepositoryInterface')
    private readonly masterMonthlyBoxRepository: MasterMonthlyBoxRepositoryInterface,
    @Inject('TransactionOperatorInterface')
    private transactionOperator: TransactionOperatorInterface,

  ) {}

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

  private getPreviousPractitionerBoxes (
    allPractitionerBoxes: PractitionerBox[]
  ): PractitionerBox[] {
    const practitionerBoxByLabel = {};
    for (const practitionerBox of allPractitionerBoxes) {
      const { practitionerId } = practitionerBox;
      if (practitionerBoxByLabel[practitionerId]) practitionerBoxByLabel[practitionerId].push(practitionerBox);
      else practitionerBoxByLabel[practitionerId] = [practitionerBox];
    }
    const returnValue: PractitionerBox[] = [];
    for (const label in practitionerBoxByLabel) {
      const previousBox = practitionerBoxByLabel[label][practitionerBoxByLabel[label].length - 1];
      returnValue.push(previousBox);
    }
    return returnValue;

  }
  private swapTargetProducts(
    targetBox: PractitionerBox,
    newProducts: Product[], // teatis chosen 12 products
    allProducts: Product[],
  ): PractitionerBox {
    const targetProductsSku: string[] = targetBox.products.map(({ sku }) => sku);
    const chosenProductsSku: string[] = newProducts.map(newProduct => newProduct.sku);
    const chooseableProducts: Product[] = allProducts.filter(product => {
      return ![...targetProductsSku, ...chosenProductsSku].includes(product.sku);
    });
    const newPractitionerBoxProducts: Product[] = [];
    for(const { id, sku, label, name } of newProducts){
      const duplicateProductIndex = targetBox.products.findIndex(product => product.sku === sku);
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
    const [upsertPractitionerBox, upsertPractitionerBoxError] =
      await this.transactionOperator
        .performAtomicOperations(
          [this.masterMonthlyBoxRepository, this.productGeneralRepository, this.practitionerBoxRepository],
          async (): Promise<ReturnValueType<PractitionerAndBox[]>> => {
            const [masterMonthlyBox, getMasterMonthlyBoxError] =
              await this.masterMonthlyBoxRepository.getMasterMonthlyBoxByLabel({ label: targetBoxLabel });
            if(getMasterMonthlyBoxError){
              return [undefined, getMasterMonthlyBoxError];
            }

            await this.practitionerBoxRepository
              .deletePractitionerBoxesByMasterMonthlyBoxId({ id: masterMonthlyBox.id });

            const [allPractitionerBoxes, allPractitionerBoxesError] =
              await this.practitionerBoxRepository.getAllPractitionerBoxes();
            if (allPractitionerBoxesError) { [undefined, allPractitionerBoxesError]; }

            const [allProducts, allProductsError] =
              await this.productGeneralRepository.getAllProducts(
                { medicalConditions: { highBloodPressure: false, highCholesterol: false } });
            if (allProductsError) { [undefined, allProductsError]; }

            const newestPractitionerBoxes: PractitionerBox[] =
              this.filterDuplicatePractitionerBox(allPractitionerBoxes);

            const newProducts:Product[] =
              allProducts.filter(({ id }) => newProductIds.find((val) => val.id === id));

            const upsertTarget: PractitionerBox[] = [];
            for(const newRecurringPractitionerBox of newestPractitionerBoxes){
              const uuid = uuidv4();
              newRecurringPractitionerBox.uuid = uuid;
              newRecurringPractitionerBox.masterMonthlyBox = { id: masterMonthlyBox.id, label: masterMonthlyBox.label };
              const originalLabel = newRecurringPractitionerBox.label.split('___');
              newRecurringPractitionerBox.label = `Recurring___${nextMonth()}___${originalLabel[originalLabel.length - 1]}`;
              upsertTarget.push(this.swapTargetProducts(newRecurringPractitionerBox, newProducts, allProducts));
            }

            const resultList:PractitionerAndBox[] = [];

            for(const box of upsertTarget){
              const [upsertPractitionerBox, upsertPractitionerBoxError] =
              await this.practitionerBoxRepository.upsertPractitionerBox(
                { practitionerBox: box, masterMonthlyBox });
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

