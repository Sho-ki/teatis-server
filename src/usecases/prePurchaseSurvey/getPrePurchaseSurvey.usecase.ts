import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';
import { ProductFeature } from '../../domains/Product';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';

export interface GetPrePurchaseSurveyUsecaseInterface {
  getPrePurchaseSurveyQuestions(): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetPrePurchaseSurveyUsecase
implements GetPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
  ) {}

  private sortOptions(list: ProductFeature[]): ProductFeature[] {
    list.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });
    return list;
  }

  async getPrePurchaseSurveyQuestions(): Promise<ReturnValueType<ActiveSurvey>> {
    const [getSurveyQuestions, getSurveyQuestionsError] =
        await this.surveyQuestionsRepository.getSurveyQuestions({ surveyName: SurveyName.PrePurchase });
    if (getSurveyQuestionsError) {
      return [undefined, getSurveyQuestionsError];
    }
    let [[flavors], [ingredients], [allergens]] =
    await Promise.all(
      [this.productGeneralRepository.getOptions({ target: 'flavor' }), this.productGeneralRepository.getOptions({ target: 'ingredient' }), this.productGeneralRepository.getOptions({ target: 'allergen' })]);

    flavors= [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(flavors)];
    allergens = [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(allergens)];
    ingredients= [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(ingredients), { id: -1, name: 'others', label: 'Others' }];

    for(const question of getSurveyQuestions.surveyQuestions){
      switch(question.name){
        case 'dislikeFlavors':
          question.options = flavors;
          break;
        case 'dislikeIngredients':
          question.options = ingredients;
          break;
        case 'allergens':
          question.options = allergens;
          break;
      }

    }

    return [getSurveyQuestions];
  }
}