import { Inject, Injectable } from '@nestjs/common';

import {
  GetLastOrderRes,
  ShipheroRepoInterface,
} from '../../repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import { GetNextBoxSurveyDto } from '../../controllers/discoveries/dtos/getNextBoxSurvey';
import { Product } from '../../domains/Product';
import {
  CustomerNextBoxSurveyRepoInterface,
  GetNextWantRes,
} from '../../repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '../../repositories/dataAnalyze/dataAnalyzeRepo';

interface GetNextBoxUsecaseArgs extends GetNextBoxSurveyDto {
  productCount: number;
}

interface GetNextBoxUsecaseRes {
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
  products: Omit<Product, 'nutritionFact'>[];
  nextWantProducts?: number[];
}

export interface GetNextBoxUsecaseInterface {
  getNextBoxSurvey({
    email,
    uuid,
    productCount,
  }: GetNextBoxUsecaseArgs): Promise<[GetNextBoxUsecaseRes, Error]>;
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
    nextWantProducts,
  }: FilterProductsArgs): Omit<Product, 'nutritionFact'>[] {
    let filteredProducts: Omit<Product, 'nutritionFact'>[] = products;
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
  }: GetNextBoxUsecaseArgs): Promise<[GetNextBoxUsecaseRes, Error]> {
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
    let nextBoxProducts: GetNextBoxUsecaseRes = { products: [] };

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
          });
        }
      }
    }

    return [nextBoxProducts, null];
  }
}
