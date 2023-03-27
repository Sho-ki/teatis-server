import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ProductFeature } from '../../domains/Product';
import { ActiveSurvey } from '../../domains/Survey';
import { ReturnValueType } from '../../filter/customError';

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

export interface GetProductOptionsUtilInterface {
  getProductOptions(survey:ActiveSurvey): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetProductOptionsUtil implements GetProductOptionsUtilInterface {
  constructor(
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,

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

  async getProductOptions(survey:ActiveSurvey): Promise<ReturnValueType<ActiveSurvey>> {
    let [[flavors], [ingredients], [allergens]] =
    await Promise.all(
      [this.productGeneralRepository.getOptions({ target: 'flavor' }), this.productGeneralRepository.getOptions({ target: 'ingredient' }), this.productGeneralRepository.getOptions({ target: 'allergen' })]);

    flavors= [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(flavors)];
    allergens = [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(allergens)];
    ingredients= [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(ingredients), { id: -1, name: 'others', label: 'Others' }];

    for(const question of survey.surveyQuestions){

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

    return [survey];
  }
}