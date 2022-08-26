import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBox } from '@Domains/PractitionerBox';
import { ReturnValueType } from '@Filters/customError';
import { CreateMasterMonthlyBoxUsecaseInterface } from '@Usecases/masterMonthlyBox/createMasterMonthlyBox.usecase';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '../practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { UpsertRecurringPractitionerBoxDto } from '../../controllers/discoveries/dtos/upsertRecurringPractitionerBox';

export interface UpsertRecurringPractitionerBoxesUsecaseInterface {
  upsertRecurringPractitionerBoxes(
 { products, label, note, description }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerBox[]>>;
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
  ): Promise<ReturnValueType<PractitionerBox[]>>{
    const [masterMonthlyBox, masterMonthlyBoxError] =
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

    // eslint-disable-next-line no-console
    console.log(masterMonthlyBox, practitionerAndBoxes );
  }
}
