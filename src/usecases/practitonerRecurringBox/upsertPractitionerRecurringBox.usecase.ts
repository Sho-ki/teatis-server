import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBox } from '@Domains/PractitionerBox';
import { ReturnValueType } from '@Filters/customError';
import { CreateTeatisBoxUsecaseInterface } from '@Usecases/teatisBox/createTeatisBox.usecase';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '../practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { UpsertRecurringPractitionerBoxDto } from '../../controllers/discoveries/dtos/upsertRecurringPractitionerBox';

export interface UpsertRecurringPractitionerBoxesUsecaseInterface {
  upsertRecurringPractitionerBoxes(
 { products, label }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerBox[]>>;
}

@Injectable()
export class UpsertRecurringPractitionerBoxesUsecase
implements UpsertRecurringPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('UpdateRecurringPractitionerBoxesUsecaseInterface')
    private updateRecurringPractitionerBoxesUsecase: UpdateRecurringPractitionerBoxesUsecaseInterface,
    @Inject('CreateTeatisBoxUsecaseInterface')
    private readonly createTeatisBoxUsecaseInterface: CreateTeatisBoxUsecaseInterface,
  ) {}
  async upsertRecurringPractitionerBoxes (
    { products: newProducts, label: targetBoxLabel, note, description }: UpsertRecurringPractitionerBoxDto
  ): Promise<ReturnValueType<PractitionerBox[]>>{
    const [teatisBox, teatisBoxError] = await this.createTeatisBoxUsecaseInterface.createTeatisBox(
      { products: newProducts, label: targetBoxLabel, note, description });

    if(teatisBoxError){
      return [undefined, teatisBoxError];
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
    console.log(teatisBox, practitionerAndBoxes );
  }
}
