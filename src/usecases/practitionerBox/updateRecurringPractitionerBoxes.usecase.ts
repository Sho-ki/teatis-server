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
import { MasterMonthlyBoxRepositoryInterface } from '../../repositories/teatisDB/masterMonthlyBox/masterMonthlyBox.repository';
import { MasterMonthlyBox } from '../../domains/MasterMonthlyBox';
import { calculateAddedAndDeletedIds } from '@Usecases/utils/calculateAddedAndDeletedIds';

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
    @Inject('MasterMonthlyBoxRepositoryInterface')
    private readonly masterMonthlyBoxRepository: MasterMonthlyBoxRepositoryInterface,

  ) {}

  private filterUpdatedPractitionerBoxes (
    newestPractitionerBoxes: PractitionerBox[],
    masterMonthlyBox: MasterMonthlyBox,
  ): [PractitionerBox[], PractitionerBox[]] {
    const updatedPractitionerBox: PractitionerBox[] =[];
    const outdatedPractitionerBox: PractitionerBox[] = [];
    for(const practitionerBox of newestPractitionerBoxes){
      if(practitionerBox?.masterMonthlyBox?.label !== masterMonthlyBox.label ){
        outdatedPractitionerBox.push(practitionerBox);
      }else {
        updatedPractitionerBox.push(practitionerBox);
      }
    }
    return [updatedPractitionerBox, outdatedPractitionerBox];
  }

  private getPreviousPractitionerBoxes (
    allPractitionerBoxes: PractitionerBox[],
  ): PractitionerBox[] {
    const newestPractitionerBoxes: PractitionerBox[] =
      allPractitionerBoxes.filter((allPractitionerBox, _, otherPractitionerBoxes) => {
        if (!allPractitionerBox.masterMonthlyBox?.id) return true;
        for (const otherPractitionerBox of otherPractitionerBoxes) {
          if (allPractitionerBox.practitionerId === otherPractitionerBox.practitionerId) {
            const masterId = otherPractitionerBox.masterMonthlyBox?.id;
            const isMasterIdNull = !masterId;
            if (isMasterIdNull) return true;
            if (allPractitionerBox.masterMonthlyBox.id !== masterId) return true;
          }
        }
        return false;
      }
      );
    return newestPractitionerBoxes;
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

    const [masterMonthlyBox, getMasterMonthlyBoxError] =
    await this.masterMonthlyBoxRepository.getMasterMonthlyBoxByLabel({ label: targetBoxLabel });

    if(getMasterMonthlyBoxError){
      return [undefined, getMasterMonthlyBoxError];
    }
    if (allProductsError) { [undefined, allProductsError]; }
    const newestPractitionerBoxes = this.getPreviousPractitionerBoxes(allPractitionerBoxes);
    newestPractitionerBoxes.forEach((box) => {
      if (box.practitionerId === 1) {
        console.log('newestPractitionerBoxes', box);
      }
    });

    // no need
    const [existingRecurringBoxes, newRecurringBoxes] =
      this.filterUpdatedPractitionerBoxes(newestPractitionerBoxes, masterMonthlyBox);

    const newProducts:Product[] =
      allProducts.filter(({ id }) => newProductIds.find((val) => val.id === id));

    const upsertTarget = [...existingRecurringBoxes];
    for(const newRecurringBox of newRecurringBoxes){
      const uuid = uuidv4();
      newRecurringBox.uuid = uuid;
      const originalLabel = newRecurringBox.label.split('___');
      newRecurringBox.label = `Recurring___${nextMonth()}___${originalLabel[originalLabel.length - 1]}`;
      upsertTarget.push(this.swapTargetProducts(newRecurringBox, newProducts, allProducts));
    }

    const [upsertPractitionerBox, upsertPractitionerBoxError] =
      await this.practitionerBoxRepository.performAtomicOperations(
        async (): Promise<ReturnValueType<PractitionerAndBox[]>> => {
          const resultList:PractitionerAndBox[] = [];

          await Promise.all(
            upsertTarget.map((box) => {
              this.practitionerBoxRepository.upsertPractitionerBox(
                { practitionerBox: box, masterMonthlyBox })
                .then(([upsertPractitionerBox, upsertPractitionerBoxError]) => {
                  if(upsertPractitionerBoxError){
                    throw Error(upsertPractitionerBoxError.message);
                  }
                  resultList.push(upsertPractitionerBox);
                }).catch((error) => {
                  throw Error(error);
                });
            })
          );
          return [resultList];
        },
      );
    if (upsertPractitionerBoxError) {
      return [undefined, upsertPractitionerBoxError];
    }
    return [upsertPractitionerBox];
  }
}
