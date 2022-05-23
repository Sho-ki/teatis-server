import { Inject, Injectable } from '@nestjs/common';

import {
  GetLastOrderRes,
  ShipheroRepoInterface,
} from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { GetNextBoxSurveyDto } from '@Controllers/discoveries/dtos/getNextBoxSurvey';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
} from '@Domains/Product';
import { CustomerNextBoxSurveyRepoInterface } from '@Repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyzeRepo';
import { AverageScores } from '../../domains/AverageScores';

interface GetNextBoxArgs extends GetNextBoxSurveyDto {
  productCount: number;
}

export interface GetNextBoxRes {
  products: DisplayProduct[];
}

interface FilterProductsArgs {
  filterType:
    | 'inventry'
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwant';
  customerFilter: { id?: number[]; sku?: string[] };
  products: DisplayAnalyzeProduct[];
  nextWantProducts?: Product[];
}

export interface GetNextBoxInterface {
  getNextBoxSurvey({
    email,
    uuid,
    productCount,
  }: GetNextBoxArgs): Promise<[GetNextBoxRes, Error]>;
}

@Injectable()
export class GetNextBox implements GetNextBoxInterface {
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('AnalyzePreferenceRepoInterface')
    private analyzePreferenceRepo: AnalyzePreferenceRepoInterface,
    @Inject('CustomerNextBoxSurveyRepoInterface')
    private customerNextBoxSurveyRepo: CustomerNextBoxSurveyRepoInterface,
  ) {}

  private filterProducts({
    filterType,
    customerFilter,
    products,
    nextWantProducts,
  }: FilterProductsArgs): DisplayAnalyzeProduct[] {
    let filteredProducts: DisplayAnalyzeProduct[] = products;
    filteredProducts = products.filter((product) => {
      switch (filterType) {
        case 'inventry':
          return !customerFilter.sku.includes(product.sku);
        case 'flavorDislikes':
          return (
            !customerFilter.id.includes(product.flavor.id) ||
            nextWantProducts.includes(product)
          );
        case 'allergens':
          for (let allergen of product.allergens) {
            if (
              customerFilter.id.includes(allergen.id) &&
              !nextWantProducts.some((nextWant) => nextWant.id === product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unavailableCookingMethods':
          for (let cookingMethod of product.cookingMethods) {
            if (
              customerFilter.id.includes(cookingMethod.id) &&
              !nextWantProducts.some((nextWant) => nextWant.id === product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unwant':
          return (
            !customerFilter.id.includes(product.id) ||
            nextWantProducts.some((nextWant) => nextWant.id === product.id)
          );
        default:
          break;
      }
    });

    return filteredProducts;
  }

  async getNextBoxSurvey({
    email,
    uuid,
    productCount,
  }: GetNextBoxArgs): Promise<[GetNextBoxRes, Error]> {
    let [NextWantProducts, getNextWantError]: [Product[]?, Error?] = [
      undefined,
      undefined,
    ];
    let [getLastOrderRes, getLastOrderError]: [GetLastOrderRes, Error] = [
      { products: [], orderNumber: '' },
      null,
    ];
    let [Scores, getAverageScoresError]: [AverageScores?, Error?] = [
      undefined,
      undefined,
    ];
    // When the first box, uuid would exist
    if (uuid) {
      const [Customer, getCustomerError] =
        await this.customerGeneralRepo.getCustomerByUuid({ uuid });
      if (getCustomerError) {
        return [null, getCustomerError];
      }
      email = Customer.email;
    } else if (email) {
      [
        [getLastOrderRes, getLastOrderError],
        [NextWantProducts, getNextWantError],
        [Scores, getAverageScoresError],
      ] = await Promise.all([
        this.shipheroRepo.getLastOrder({
          email,
        }),
        this.customerNextBoxSurveyRepo.getNextWant({
          orderNumber: getLastOrderRes.orderNumber,
        }),
        this.customerNextBoxSurveyRepo.getAverageScores({ email }),
      ]);
      if (getLastOrderError) {
        return [null, getLastOrderError];
      }
      if (getNextWantError) {
        return [null, getNextWantError];
      }
      if (getAverageScoresError) {
        return [null, getAverageScoresError];
      }
      if (NextWantProducts.length > 0) {
        productCount -= NextWantProducts.length;
      }
    }

    const [
      [MedicalCondition, getCustomerConditionError],
      [NoInventryProducts, getNoInventryProductsError],
      [CustomerFlavorDislikes, customerFlavorDislikesError],
      [CustomerAllergens, customerAllergensError],
      [
        CustomerUnavailableCookingMethods,
        customerUnavailableCookingMethodsError,
      ],
      [CustomerCategoryPreferences, customerCategoryPreferencesError],
      [NextUnwantProducts, getCustomerUnwantError],
    ] = await Promise.all([
      this.customerGeneralRepo.getCustomerCondition({ email }),
      this.shipheroRepo.getNonInventryProducts(),
      this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'flavorDislikes',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'allergens',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'unavailableCookingMethods',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'categoryPreferences',
      }),
      this.customerNextBoxSurveyRepo.getNextUnwant({ email }),
    ]);

    if (getCustomerConditionError) {
      return [null, getCustomerConditionError];
    }

    let [DisplayAnalyzeProducts, getDisplayAnalyzeProductsError] =
      await this.productGeneralRepo.getAllProducts({
        medicalCondtions: MedicalCondition,
      });
    if (getDisplayAnalyzeProductsError) {
      return [null, getDisplayAnalyzeProductsError];
    }
    let allProducts: DisplayAnalyzeProduct[] = DisplayAnalyzeProducts.sort(
      () => Math.random() - 0.5,
    );

    if (getNoInventryProductsError) {
      return [null, getNoInventryProductsError];
    }
    if (NoInventryProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'inventry',
        customerFilter: {
          sku: NoInventryProducts.map(({ sku }) => {
            return sku;
          }),
        },
        products: allProducts,
      });
    }

    if (customerFlavorDislikesError) {
      return [null, customerFlavorDislikesError];
    }
    if (CustomerFlavorDislikes.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'flavorDislikes',
        customerFilter: CustomerFlavorDislikes,
        products: allProducts,
        nextWantProducts: NextWantProducts,
      });
    }

    if (customerAllergensError) {
      return [null, customerAllergensError];
    }
    if (CustomerAllergens.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'allergens',
        customerFilter: CustomerAllergens,
        products: allProducts,
        nextWantProducts: NextWantProducts,
      });
    }

    if (customerUnavailableCookingMethodsError) {
      return [null, customerUnavailableCookingMethodsError];
    }
    if (CustomerUnavailableCookingMethods.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unavailableCookingMethods',
        customerFilter: CustomerUnavailableCookingMethods,
        products: allProducts,
        nextWantProducts: NextWantProducts,
      });
    }

    if (customerCategoryPreferencesError) {
      return [null, customerCategoryPreferencesError];
    }

    if (getCustomerUnwantError) {
      return [null, getCustomerUnwantError];
    }
    if (NextUnwantProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unwant',
        customerFilter: {
          id: NextUnwantProducts.map(({ id }) => {
            return id;
          }),
        },
        products: allProducts,
        nextWantProducts: NextWantProducts,
      });
    }

    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responces: productCount,
      products: [],
      user_fav_categories: CustomerCategoryPreferences.id || [
        7, 15, 17, 18, 19, 6, 4, 3, 13, 25, 11, 26, 14, 10,
      ], // when nothing is selected, choose all the categories
    };
    let nextBoxProducts: GetNextBoxRes = { products: [] };

    for (let product of allProducts) {
      if (
        NextWantProducts &&
        NextWantProducts.some((nextWant) => nextWant.id === product.id)
      ) {
        const {
          id,
          sku,
          name,
          label,
          vendor,
          images,
          expertComment,
          ingredientLabel,
          allergenLabel,
          nutritionFact,
        } = product;
        nextBoxProducts.products.unshift({
          id,
          sku,
          name,
          label,
          vendor,
          images,
          expertComment,
          ingredientLabel,
          allergenLabel,
          nutritionFact: {
            calorie: nutritionFact.calorie,
            totalFat: nutritionFact.totalFat,
            saturatedFat: nutritionFact.saturatedFat,
            transFat: nutritionFact.transFat,
            cholesterole: nutritionFact.cholesterole,
            sodium: nutritionFact.sodium,
            totalCarbohydrate: nutritionFact.totalCarbohydrate,
            dietaryFiber: nutritionFact.dietaryFiber,
            totalSugar: nutritionFact.totalSugar,
            addedSugar: nutritionFact.addedSugar,
            protein: nutritionFact.protein,
          },
        });
        continue;
      }
      let shippableProduct: CustomerShippableProduct = {
        product_id: product.id,
        product_sku: product.sku,
        flavor_id: product.flavor.id,
        category_id: product.category.id,
        is_sent_1: 0,
        avg_flavor_score: Scores?.flavorLikesAverages[product.flavor.id] || 5,
        avg_category_score:
          Scores?.categoryLikesAverages[product.category.id] || 5,
      };
      for (let lastSentProduct of getLastOrderRes.products) {
        if (product.sku === lastSentProduct.sku) {
          shippableProduct = { ...shippableProduct, is_sent_1: 1 };
          break;
        }
      }
      customerShippableProducts.products.push(shippableProduct);
    }
    const [analyzedProductsRes, analyzedProductsError] =
      await this.analyzePreferenceRepo.getAnalyzedProducts(
        customerShippableProducts,
      );

    for (let product of allProducts) {
      for (let analyzedProduct of analyzedProductsRes.products) {
        if (product.id === analyzedProduct.product_id) {
          const {
            id,
            sku,
            name,
            label,
            vendor,
            images,
            expertComment,
            ingredientLabel,
            allergenLabel,
            nutritionFact,
          } = product;
          nextBoxProducts.products.push({
            id,
            sku,
            name,
            label,
            vendor,
            images,
            expertComment,
            ingredientLabel,
            allergenLabel,
            nutritionFact: {
              calorie: nutritionFact.calorie,
              totalFat: nutritionFact.totalFat,
              saturatedFat: nutritionFact.saturatedFat,
              transFat: nutritionFact.transFat,
              cholesterole: nutritionFact.cholesterole,
              sodium: nutritionFact.sodium,
              totalCarbohydrate: nutritionFact.totalCarbohydrate,
              dietaryFiber: nutritionFact.dietaryFiber,
              totalSugar: nutritionFact.totalSugar,
              addedSugar: nutritionFact.addedSugar,
              protein: nutritionFact.protein,
            },
          });
        }
      }
    }

    return [nextBoxProducts, null];
  }
}
