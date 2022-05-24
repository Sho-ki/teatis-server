import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
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

import { CustomerOrder } from '@Domains/CustomerOrder';
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
    customerFilter = { id: [], sku: [] },
    products,
    nextWantProducts = [],
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
    let [nextWantProducts, getNextWantError]: [Product[]?, Error?] = [
      undefined,
      undefined,
    ];

    let [lastCustomerOrder, getLastCustomerOrderError]: [CustomerOrder, Error] =
      [{ products: [], orderNumber: '', orderDate: '', orderId: '' }, null];

    let [Scores, getAverageScoresError]: [AverageScores?, Error?] = [
      undefined,
      undefined,
    ];

    // When the first box, uuid would exist
    if (uuid) {
      const [customer, getCustomerError] =
        await this.customerGeneralRepo.getCustomerByUuid({ uuid });
      if (getCustomerError) {
        return [null, getCustomerError];
      }
      email = customer.email;
    } else if (email) {

      [
         [lastCustomerOrder, getLastCustomerOrderError] ,
        [nextWantProducts, getNextWantError],
        [Scores, getAverageScoresError],
      ] = await Promise.all([
        this.shipheroRepo.getLastCustomerOrder({
          email,
        }),
        this.customerNextBoxSurveyRepo.getNextWant({
          orderNumber: lastCustomerOrder.orderNumber,
        }),
        this.customerNextBoxSurveyRepo.getAverageScores({ email }),
      ]);
      if (getLastCustomerOrderError) {
        return [null, getLastCustomerOrderError];
      }
      if (getNextWantError) {
        return [null, getNextWantError];
      }
      if (getAverageScoresError) {
        return [null, getAverageScoresError];
      }
      if (nextWantProducts.length > 0) {
        productCount -= nextWantProducts.length;

      }
    }

    const [
      [customerMedicalCondition, getCustomerMedicalConditionError],
      [noInventryProducts, getNoInventryProductsError],
      [customerFlavorDislikes, customerFlavorDislikesError],
      [customerAllergens, customerAllergensError],
      [
        customerUnavailableCookingMethods,
        customerUnavailableCookingMethodsError,
      ],
      [customerCategoryPreferences, customerCategoryPreferencesError],
      [nextUnwantProducts, getCustomerUnwantError],
    ] = await Promise.all([
      this.customerGeneralRepo.getCustomerMedicalCondition({ email }),
      this.shipheroRepo.getNoInventryProducts(),
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

    if (getCustomerMedicalConditionError) {
      return [null, getCustomerMedicalConditionError];
    }

    let [displayAnalyzeProducts, getDisplayAnalyzeProductsError] =
      await this.productGeneralRepo.getAllProducts({
        medicalCondtions: customerMedicalCondition,
      });
    if (getDisplayAnalyzeProductsError) {
      return [null, getDisplayAnalyzeProductsError];
    }
    let allProducts: DisplayAnalyzeProduct[] = displayAnalyzeProducts.sort(
      () => Math.random() - 0.5,
    );

    if (getNoInventryProductsError) {
      return [null, getNoInventryProductsError];
    }
    if (noInventryProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'inventry',
        customerFilter: {
          sku: noInventryProducts.map(({ sku }) => {
            return sku;
          }),
        },
        products: allProducts,
      });
    }

    if (customerFlavorDislikesError) {
      return [null, customerFlavorDislikesError];
    }
    if (customerFlavorDislikes.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'flavorDislikes',
        customerFilter: customerFlavorDislikes,
        products: allProducts,
        nextWantProducts: nextWantProducts,
      });
    }

    if (customerAllergensError) {
      return [null, customerAllergensError];
    }
    if (customerAllergens.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'allergens',
        customerFilter: customerAllergens,
        products: allProducts,
        nextWantProducts: nextWantProducts,
      });
    }

    if (customerUnavailableCookingMethodsError) {
      return [null, customerUnavailableCookingMethodsError];
    }
    if (customerUnavailableCookingMethods.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unavailableCookingMethods',
        customerFilter: customerUnavailableCookingMethods,
        products: allProducts,
        nextWantProducts: nextWantProducts,
      });
    }

    if (customerCategoryPreferencesError) {
      return [null, customerCategoryPreferencesError];
    }

    if (getCustomerUnwantError) {
      return [null, getCustomerUnwantError];
    }
    if (nextUnwantProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unwant',
        customerFilter: {
          id: nextUnwantProducts.map(({ id }) => {
            return id;
          }),
        },
        products: allProducts,
        nextWantProducts: nextWantProducts,
      });
    }
    const allCategories = [18, 19, 7, 15, 17, 6, 4, 3, 13, 25, 11, 26, 14, 10];
    const favoriteCategories = customerCategoryPreferences.id.length
      ? customerCategoryPreferences.id
      : allCategories; // when nothing is selected, choose all the categories
    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responces: productCount,
      products: [],

      user_fav_categories: favoriteCategories,

    };
    let nextBoxProducts: GetNextBoxRes = { products: [] };

    for (let product of allProducts) {
      if (
        nextWantProducts &&
        nextWantProducts.some((nextWant) => nextWant.id === product.id)

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
      for (let lastSentProduct of lastCustomerOrder.products) {
        if (product.sku === lastSentProduct.sku) {
          shippableProduct = { ...shippableProduct, is_sent_1: 1 };
          break;
        }
      }
      customerShippableProducts.products.push(shippableProduct);
    }
    let [analyzedProductsRes, analyzedProductsError] =
      await this.analyzePreferenceRepo.getAnalyzedProducts(
        customerShippableProducts,
      );
    if (analyzedProductsRes.is_success === 'false') {
      customerShippableProducts.user_fav_categories.push(
        allCategories[0], // Chocolate
        allCategories[1], // Cookie/Brownie
        allCategories[2], // Meal Shake
      );
      [analyzedProductsRes, analyzedProductsError] =
        await this.analyzePreferenceRepo.getAnalyzedProducts(
          customerShippableProducts,
        );
    }
    if (analyzedProductsError) {
      return [null, analyzedProductsError];
    }
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
          const nextProduct: DisplayProduct = {
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
          };
          if (favoriteCategories.includes(product.category.id)) {
            nextBoxProducts.products.unshift(nextProduct);
          } else nextBoxProducts.products.push(nextProduct);
          continue;
        }
      }
    }

    return [nextBoxProducts, null];
  }
}
