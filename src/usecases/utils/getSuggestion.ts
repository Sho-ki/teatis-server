import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
} from '@Domains/Product';
import { CustomerPreferenceRepoInterface } from '@Repositories/teatisDB/customerRepo/customerPreference.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyzeRepo';

import { Customer } from '@Domains/Customer';

interface GetSuggestionArgs {
  customer: Customer;
  productCount: number;
  includeProducts?: Pick<Product, 'sku'>[];
  excludeProducts?: Pick<Product, 'sku'>[];
}

export interface GetSuggestionRes {
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

export interface GetSuggestionInterface {
  getSuggestion({
    customer,
    productCount,
    includeProducts,
    excludeProducts,
  }: GetSuggestionArgs): Promise<[GetSuggestionRes, Error]>;
}

@Injectable()
export class GetSuggestion implements GetSuggestionInterface {
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('AnalyzePreferenceRepoInterface')
    private analyzePreferenceRepo: AnalyzePreferenceRepoInterface,
    @Inject('CustomerPreferenceRepoInterface')
    private customerPreferenceRepo: CustomerPreferenceRepoInterface,
  ) {}

  private filterProducts({
    filterType,
    customerFilter = { id: [] as number[], sku: [] as string[] },
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

  async getSuggestion({
    customer,
    productCount,
    includeProducts = [],
    excludeProducts = [],
  }: GetSuggestionArgs): Promise<[GetSuggestionRes, Error]> {
    let isFirstOrder = false;
    const [lastCustomerOrder, getLastCustomerOrderError] =
      await this.shipheroRepo.getLastCustomerOrder({
        email: customer.email,
      });
    if (getLastCustomerOrderError) {
      return [null, getLastCustomerOrderError];
    }
    if (lastCustomerOrder.products.length === 0) {
      isFirstOrder = true;
    }
    const [
      [scores, getAverageScoresError],
      [nextWantProducts, getNextWantError],
      [nextUnwantProducts, getCustomerUnwantError],
    ] = !isFirstOrder
      ? await Promise.all([
          this.customerPreferenceRepo.getAverageScores({
            email: customer.email,
          }),
          this.customerPreferenceRepo.getNextWant({
            orderNumber: lastCustomerOrder.orderNumber,
          }),
          this.customerPreferenceRepo.getNextUnwant({ email: customer.email }),
        ])
      : [[], [], []];

    if (getAverageScoresError) {
      return [null, getAverageScoresError];
    }
    if (getNextWantError) {
      return [null, getNextWantError];
    }
    if (getCustomerUnwantError) {
      return [null, getCustomerUnwantError];
    }
    if (nextWantProducts && nextWantProducts.length > 0) {
      productCount -= nextWantProducts.length;
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
    ] = await Promise.all([
      this.customerGeneralRepo.getCustomerMedicalCondition({
        email: customer.email,
      }),
      this.shipheroRepo.getNoInventryProducts(),
      this.customerGeneralRepo.getCustomerPreference({
        email: customer.email,
        type: 'flavorDislikes',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email: customer.email,
        type: 'allergens',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email: customer.email,
        type: 'unavailableCookingMethods',
      }),
      this.customerGeneralRepo.getCustomerPreference({
        email: customer.email,
        type: 'categoryPreferences',
      }),
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
        nextWantProducts,
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
        nextWantProducts,
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
        nextWantProducts,
      });
    }

    if (customerCategoryPreferencesError) {
      return [null, customerCategoryPreferencesError];
    }

    if (nextUnwantProducts && nextUnwantProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unwant',
        customerFilter: {
          id: nextUnwantProducts.map(({ id }) => {
            return id;
          }),
        },
        products: allProducts,
        nextWantProducts,
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
    let nextBoxProducts: GetSuggestionRes = { products: [] };

    for (let product of allProducts) {
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
      if (
        includeProducts.some(({ sku }) => sku === product.sku) ||
        (nextWantProducts &&
          nextWantProducts.some((nextWant) => nextWant.id === product.id))
      ) {
        nextBoxProducts.products.unshift({
          id,
          sku,
          name,
          label,
          vendor: vendor.label,
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
      } else if (excludeProducts.some(({ sku }) => sku === product.sku)) {
        continue;
      } else {
        let shippableProduct: CustomerShippableProduct = {
          product_id: product.id,
          product_sku: product.sku,
          flavor_id: product.flavor.id,
          category_id: product.category.id,
          vendor_id: product.vendor.id,
          is_sent_1: 0,
          avg_flavor_score: scores?.flavorLikesAverages[product.flavor.id] || 5,
          avg_category_score:
            scores?.categoryLikesAverages[product.category.id] || 5,
        };
        if (!isFirstOrder) {
          for (let lastSentProduct of lastCustomerOrder.products) {
            if (product.sku === lastSentProduct.sku) {
              shippableProduct = { ...shippableProduct, is_sent_1: 1 };
              break;
            }
          }
        }

        customerShippableProducts.products.push(shippableProduct);
      }
    }

    customerShippableProducts = {
      ...customerShippableProducts,
      necessary_responces: productCount - nextBoxProducts.products.length,
    };
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
            vendor: vendor.label,
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
          nextBoxProducts.products.push(nextProduct);
          continue;
        }
      }
    }

    return [nextBoxProducts, null];
  }
}
