import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CreateMasterMonthlyBoxUsecaseInterface } from '@Usecases/masterMonthlyBox/createMasterMonthlyBox.usecase';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '../practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { UpsertRecurringPractitionerBoxDto } from '../../controllers/discoveries/dtos/upsertRecurringPractitionerBox';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';

export interface UpsertRecurringPractitionerBoxesUsecaseInterface {
  upsertRecurringPractitionerBoxes(
 { products, label, note, description }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerAndBox[]>>;
}

@Injectable()
export class UpsertRecurringPractitionerBoxesUsecase
implements UpsertRecurringPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('UpdateRecurringPractitionerBoxesUsecaseInterface')
    private updateRecurringPractitionerBoxesUsecase: UpdateRecurringPractitionerBoxesUsecaseInterface,
    @Inject('CreateMasterMonthlyBoxUsecaseInterface')
    private readonly createMasterMonthlyBoxUsecaseInterface: CreateMasterMonthlyBoxUsecaseInterface,
  ) {}
  async upsertRecurringPractitionerBoxes (
    { products: newProducts, label: targetBoxLabel, note, description }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerAndBox[]>>{
    const [, masterMonthlyBoxError] =
    await this.createMasterMonthlyBoxUsecaseInterface.createMasterMonthlyBox(
      { products: newProducts, label: targetBoxLabel, note, description });
    if(masterMonthlyBoxError){
      return [undefined, masterMonthlyBoxError];
    }
    const [practitionerAndBoxes, practitionerAndBoxesError] =
      await this.updateRecurringPractitionerBoxesUsecase.upsertRecurringPractitionerBoxes({
        products: newProducts,
        label: targetBoxLabel,
      });

    if(practitionerAndBoxesError){
      return [undefined, practitionerAndBoxesError];
    }
    return [practitionerAndBoxes, undefined];
  }
}
