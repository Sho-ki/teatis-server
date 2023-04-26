import { IsEnum, registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IsArray, IsString } from 'class-validator';
import { SurveyName } from '../../../../usecases/utils/surveyName';

@ValidatorConstraint({ name: 'eitherResponseIdsOrResponseId', async: false })
export class EitherResponseIdsOrResponseIdValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(value: any) {
    for (const customerResponse of value) {

      if(customerResponse.responseId && Array.isArray(customerResponse.responseId)){
        return false;
      }
      if(customerResponse.responseIds && !Array.isArray(customerResponse.responseIds)){
        return false;
      }
      if ((customerResponse.responseIds && customerResponse.responseId)||
       (!customerResponse.responseIds && !customerResponse.responseId)) {
        return false;
      }
    }

    return true;
  }
}

export function EitherResponseIdsOrResponseId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EitherResponseIdsOrResponseIdValidator,
    });
  };
}

export class PostPrePurchaseSurveyNonSettingDto {
  @IsEnum(SurveyName)
    surveyName: SurveyName = SurveyName.PrePurchase;

  @IsString()
    uuid: string;

  @IsArray()
  @EitherResponseIdsOrResponseId()
    customerResponses: {
    surveyQuestionId: number;
    responseIds?: number[];
    responseId?: number;
  }[];
}
