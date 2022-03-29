import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '../../repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from '../../domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import { GetNextBoxSurveyDto } from '../../controllers/discoveries/dtos/getNextBoxSurvey';
import { Product } from '../../domains/Product';
import { CustomerNextBoxSurveyRepoInterface } from '../../repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '../../repositories/dataAnalyze/dataAnalyzeRepo';

interface GetNextBoxUsecaseRes {
  products: Pick<
    Product,
    'id' | 'sku' | 'name' | 'label' | 'vendor' | 'images' | 'expertComment'
  >[];
}

interface FilterProductsArgs {
  filterType:
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwant';
  customerFilter: { ids: number[] };
  products: Omit<Product, 'nutritionFact'>[];
}

// {
//   "products": [
//       {"product_id":1001, "product_sku":"sku_1001", "is_send_last_time":"true", "category_id": 10, "flavor_id": 30}
//       , {"product_id":1002, "product_sku":"sku_1001","is_send_last_time":"true", "category_id": 11, "flavor_id": 31}
//       , {"product_id":1003, "product_sku":"sku_1001", "is_send_last_time":"true", "category_id": 12, "flavor_id": 32}
//    ]
//   ,"necessary_responces": 15
//   ,"user_fav_categories": [10, 20, 30]
// }
// type AnalyzePreferenceReq = Pick<Product, 'id' | 'sku'> & {
//   flavorId: number;
//   categoryId: number;
//   cookingMethodIds: number[];
//   isSentLastTime: boolean;
// };

export interface GetNextBoxUsecaseInterface {
  getNextBoxSurvey({
    email,
  }: GetNextBoxSurveyDto): Promise<[GetNextBoxUsecaseRes, Error]>;
}

@Injectable()
export class GetNextBoxUsecase implements GetNextBoxUsecaseInterface {
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
  }: FilterProductsArgs): Omit<Product, 'nutritionFact'>[] {
    let filteredProducts: Omit<Product, 'nutritionFact'>[] = products;
    filteredProducts = products.filter((product) => {
      switch (filterType) {
        case 'flavorDislikes':
          return !customerFilter.ids.includes(product.flavor.id);
        case 'allergens':
          for (let allergen of product.allergens) {
            if (customerFilter.ids.includes(allergen.id)) {
              return false;
            }
          }
          return true;
        case 'unavailableCookingMethods':
          for (let cookingMethod of product.cookingMethods) {
            if (customerFilter.ids.includes(cookingMethod.id)) {
              return false;
            }
          }
          return true;
        case 'unwant':
          return !customerFilter.ids.includes(product.id);
        default:
          break;
      }
    });

    return filteredProducts;
  }

  async getNextBoxSurvey({
    email,
  }: GetNextBoxSurveyDto): Promise<[GetNextBoxUsecaseRes, Error]> {
    let productCount = 30;
    let [getAllProductsRes, getAllProductsError] =
      await this.productGeneralRepo.getAllProducts();
    if (getAllProductsError) {
      return [null, getAllProductsError];
    }
    let allProducts = getAllProductsRes.products;
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
      });
    }
    const [getLastOrderRes, getLastOrderError] =
      await this.shipheroRepo.getLastOrder({
        email,
      });
    if (getLastOrderError) {
      return [null, getLastOrderError];
    }
    const [getNextWantRes, getNextWantError] =
      await this.customerNextBoxSurveyRepo.getNextWant({
        orderNumber: getLastOrderRes.orderNumber,
      });
    if (getNextWantError) {
      return [null, getNextWantError];
    }
    if (getNextWantRes.ids.length > 0) {
      productCount -= getNextWantRes.ids.length;
    }

    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responces: productCount,
      products: [],
      user_fav_categories: customerCategoryLikes.ids,
    };
    let nextBoxProducts: GetNextBoxUsecaseRes = { products: [] };

    for (let product of allProducts) {
      if (getNextWantRes.ids.includes(product.id)) {
        nextBoxProducts.products.push(product);
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
        is_send_last_time: false,
      };
      for (let getLastOrderResProduct of getLastOrderRes.products) {
        if (product.sku === getLastOrderResProduct.sku) {
          shippableProduct = { ...shippableProduct, is_send_last_time: true };
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
          nextBoxProducts.products.push(product);
        }
      }
    }

    return [nextBoxProducts, null];
  }
}
