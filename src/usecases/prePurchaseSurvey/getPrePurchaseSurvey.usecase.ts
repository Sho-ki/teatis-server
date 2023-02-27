import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';
import { ProductFeature } from '../../domains/Product';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';
import { EmployerRepositoryInterface } from '../../repositories/teatisDB/employer/employer.repository';

const TOP_DISLIKE_INGREDIENTS = [
  'Apple',
  'Banana',
  'Bean',
  'Beef',
  'Berry',
  'Chicken',
  'Beef',
  'Butter',
  'Carrot',
  'Honey',
  'Kale',
  'Peach',
  'Potatoe',
  'Pumpkin',
  'Rhubarb',
  'Flour',
  'Rosemary',
  'Pepper',
  'Rice',
  'Soluble Corn Fiber',
  'Sugar',
  'Cherry',
  'Pecans',
  'Mushroom',
];

export interface GetPrePurchaseSurveyUsecaseInterface {
  getPrePurchaseSurveyQuestions(employerUuid?:string): Promise<ReturnValueType<ActiveSurvey>>;
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
    @Inject('EmployerRepositoryInterface')
    private readonly employerRepository: EmployerRepositoryInterface,

  ) {}

  private sortOptions(list: ProductFeature[]): ProductFeature[] {
    list.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      } else {
        return -1;
      }
    });
    return list;
  }

  async getPrePurchaseSurveyQuestions(employerUuid?:string): Promise<ReturnValueType<ActiveSurvey>> {
    if(employerUuid){
      const [employer, employerNotFound] = await this.employerRepository.getEmployerByUuid({ uuid: employerUuid });
      if(!employer) return [undefined, employerNotFound];

    }
    const [getSurveyQuestions, getSurveyQuestionsError] =
        await this.surveyQuestionsRepository.getSurveyQuestions(
          { surveyName: employerUuid ? SurveyName.EmployeePrePurchase: SurveyName.PrePurchase });
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
        case 'flavorDislikes':
          question.options = flavors;
          break;
        case 'ingredientDislikes':
          question.options = ingredients.filter(ingredient => ['None', 'Others', ...TOP_DISLIKE_INGREDIENTS].includes(ingredient.label));
          question.children[0].options =
          ingredients.filter(ingredient => !['None', 'Others'].includes(ingredient.label));
          break;
        case 'allergens':
          question.options = allergens;
          break;
      }

    }

    return [getSurveyQuestions];
  }
}

