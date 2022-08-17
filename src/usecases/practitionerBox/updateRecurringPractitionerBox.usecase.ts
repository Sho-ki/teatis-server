import { Inject, Injectable } from '@nestjs/common';
import { CreatePractitionerBoxDto } from '@Controllers/discoveries/dtos/createPractitionerBox';
import { ReturnValueType } from '@Filters/customError';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';

export interface updateRecurringPractitionerBoxUsecaseInterface {
  updateRecurringPractitionerBox(
    recurringProducts: CreatePractitionerBoxDto['products'],
    practitionerDetails: CreatePractitionerBoxDto,
  ): Promise<ReturnValueType<PractitionerAndBox>>;
}

@Injectable()
export class UpdateRecurringPractitionerBoxUsecase
implements updateRecurringPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async updateRecurringPractitionerBox(
    recurringProducts,
    practitionerDetails,
  ): Promise<ReturnValueType<PractitionerAndBox>>{
    const { practitionerId, practitionerBoxUuid, label, products, description, note } = practitionerDetails;
    const chosenProductIds: number[] = practitionerDetails.products.map(product => product.id);
    const recurringProductIds: number[] = recurringProducts.map(recurringProduct => recurringProduct.id);
    const lastChosenProducts: number[] =
      recurringProductIds.filter(recurringProduct => chosenProductIds.includes(recurringProduct));
    if (!lastChosenProducts.length) {
      const [practitionerBoxProduct, createPractitionerBoxProductError] =
        await this.practitionerBoxRepository.upsertPractitionerAndPractitionerBox({
          practitionerId,
          practitionerBoxUuid,
          label,
          products,
          description,
          note,
        });
      if(createPractitionerBoxProductError){
        return [undefined, createPractitionerBoxProductError];
      }
      return [practitionerBoxProduct, undefined];
    }
    return [undefined, undefined];
  }
}
