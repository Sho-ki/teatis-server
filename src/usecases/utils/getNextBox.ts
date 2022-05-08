import { Inject, Injectable } from '@nestjs/common';

import {
  GetLastOrderRes,
  ShipheroRepoInterface,
} from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { GetNextBoxSurveyDto } from '@Controllers/discoveries/dtos/getNextBoxSurvey';
import { Product } from '@Domains/Product';
import {
  CustomerNextBoxSurveyRepoInterface,
  GetNextWantRes,
} from '@Repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyzeRepo';

interface GetNextBoxArgs extends GetNextBoxSurveyDto {
  productCount: number;
}

export interface GetNextBoxRes {
  products: Pick<
    Product,
    | 'id'
    | 'sku'
    | 'name'
    | 'label'
    | 'vendor'
    | 'images'
    | 'expertComment'
    | 'ingredientLabel'
    | 'allergenLabel'
    | 'nutritionFact'
  >[];
}

interface FilterProductsArgs {
  filterType:
    | 'inventry'
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwant';
  customerFilter: { ids?: number[]; skus?: string[] };
  products: Product[];
  nextWantProducts?: number[];
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
  }: FilterProductsArgs): Product[] {
    let filteredProducts: Product[] = products;
    filteredProducts = products.filter((product) => {
      switch (filterType) {
        case 'inventry':
          return !customerFilter.skus.includes(product.sku);
        case 'flavorDislikes':
          return (
            !customerFilter.ids.includes(product.flavor.id) ||
            nextWantProducts.includes(product.id)
          );
        case 'allergens':
          for (let allergen of product.allergens) {
            if (
              customerFilter.ids.includes(allergen.id) &&
              !nextWantProducts.includes(product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unavailableCookingMethods':
          for (let cookingMethod of product.cookingMethods) {
            if (
              customerFilter.ids.includes(cookingMethod.id) &&
              !nextWantProducts.includes(product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unwant':
          return (
            !customerFilter.ids.includes(product.id) ||
            nextWantProducts.includes(product.id)
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
    let [getNextWantRes, getNextWantError]: [GetNextWantRes, Error] = [
      { ids: [] },
      null,
    ];
    let [getLastOrderRes, getLastOrderError]: [GetLastOrderRes, Error] = [
      { products: [], orderNumber: '' },
      null,
    ];
    // When the first box, uuid would exist
    if (uuid) {
      const [getCustomerRes, getCustomerError] =
        await this.customerGeneralRepo.getCustomerByUuid({ uuid });
      if (getCustomerError) {
        return [null, getCustomerError];
      }
      email = getCustomerRes.email;
    } else if (email) {
      [getLastOrderRes, getLastOrderError] =
        await this.shipheroRepo.getLastOrder({
          email,
        });
      if (getLastOrderError) {
        return [null, getLastOrderError];
      }
      [getNextWantRes, getNextWantError] =
        await this.customerNextBoxSurveyRepo.getNextWant({
          orderNumber: getLastOrderRes.orderNumber,
        });
      if (getNextWantError) {
        return [null, getNextWantError];
      }
      if (getNextWantRes.ids.length > 0) {
        productCount -= getNextWantRes.ids.length;
      }
    }

    const [getCustomerConditionRes, getCustomerConditionError] =
      await this.customerGeneralRepo.getCustomerCondition({ email });

    if (getCustomerConditionError) {
      return [null, getCustomerConditionError];
    }

    let [getAllProductsRes, getAllProductsError] =
      await this.productGeneralRepo.getAllProducts({
        medicalCondtions: getCustomerConditionRes,
      });
    if (getAllProductsError) {
      return [null, getAllProductsError];
    }
    let allProducts = getAllProductsRes.products.sort(
      () => Math.random() - 0.5,
    );

    const [getNoInventryProductsRes, getNoInventryProductsError] =
      await this.shipheroRepo.getNonInventryProducts();
    if (getNoInventryProductsError) {
      return [null, getNoInventryProductsError];
    }
    if (getNoInventryProductsRes.skus.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'inventry',
        customerFilter: getNoInventryProductsRes,
        products: allProducts,
      });
    }

    const [customerFlavorDislikes, customerFlavorDislikesError] =
      await this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'flavorDislikes',
      });
    if (customerFlavorDislikesError) {
      return [null, customerFlavorDislikesError];
    }
    if (customerFlavorDislikes.ids.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'flavorDislikes',
        customerFilter: customerFlavorDislikes,
        products: allProducts,
        nextWantProducts: getNextWantRes.ids,
      });
    }
    const [customerAllergens, customerAllergensError] =
      await this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'allergens',
      });
    if (customerAllergensError) {
      return [null, customerAllergensError];
    }
    if (customerAllergens.ids.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'allergens',
        customerFilter: customerAllergens,
        products: allProducts,
        nextWantProducts: getNextWantRes.ids,
      });
    }
    const [
      customerUnavailableCookingMethods,
      customerUnavailableCookingMethodsError,
    ] = await this.customerGeneralRepo.getCustomerPreference({
      email,
      type: 'unavailableCookingMethods',
    });
    if (customerUnavailableCookingMethodsError) {
      return [null, customerUnavailableCookingMethodsError];
    }
    if (customerUnavailableCookingMethods.ids.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unavailableCookingMethods',
        customerFilter: customerUnavailableCookingMethods,
        products: allProducts,
        nextWantProducts: getNextWantRes.ids,
      });
    }

    const [customerCategoryLikes, customerCategoryLikesError] =
      await this.customerGeneralRepo.getCustomerPreference({
        email,
        type: 'categoryLikes',
      });

    const [getNextUnwantRes, getCustomerUnwantError] =
      await this.customerNextBoxSurveyRepo.getNextUnwant({ email });

    if (getCustomerUnwantError) {
      return [null, getCustomerUnwantError];
    }
    if (getNextUnwantRes.ids.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unwant',
        customerFilter: getNextUnwantRes,
        products: allProducts,
        nextWantProducts: getNextWantRes.ids,
      });
    }

    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responces: productCount,
      products: [],
      user_fav_categories: customerCategoryLikes.ids,
    };
    let nextBoxProducts: GetNextBoxRes = { products: [] };

    for (let product of allProducts) {
      if (getNextWantRes.ids.includes(product.id)) {
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
        cooking_method_ids:
          product.cookingMethods.map((cookingMethod) => {
            return cookingMethod.id;
          }) || [],
        is_sent: 0,
      };
      for (let getLastOrderResProduct of getLastOrderRes.products) {
        if (product.sku === getLastOrderResProduct.sku) {
          shippableProduct = { ...shippableProduct, is_sent: 1 };
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
