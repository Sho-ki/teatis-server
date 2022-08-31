import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
} from '@Domains/Product';
import { CustomerPreferenceRepositoryInterface } from '@Repositories/teatisDB/customer/customerPreference.repository';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepositoryInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyze.respository';

import { Customer } from '@Domains/Customer';

interface GetSuggestionArgs {
  customer: Customer;
  productCount: number;
  includeProducts?: Pick<Product, 'sku'>[];
  excludeProducts?: Pick<Product, 'sku'>[];
}

// TODO : Use DisplayProduct[] as Response
export interface GetSuggestionRes {
  products: DisplayProduct[];
}

interface FilterProductsArgs {
  filterType:
    | 'ingredientDislikes'
    | 'inventory'
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwanted';
  customerFilter: { id?: number[], sku?: string[] };
  products: DisplayAnalyzeProduct[];
  nextWantProducts?: Product[];
}

export interface GetSuggestionInterface {
  getSuggestion({
    customer,
    productCount,
    includeProducts,
    excludeProducts,
  }: GetSuggestionArgs): Promise<[GetSuggestionRes?, Error?]>;
}

@Injectable()
export class GetSuggestion implements GetSuggestionInterface {
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('AnalyzePreferenceRepositoryInterface')
    private analyzePreferenceRepository: AnalyzePreferenceRepositoryInterface,
    @Inject('CustomerPreferenceRepositoryInterface')
    private customerPreferenceRepository: CustomerPreferenceRepositoryInterface,
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
        case 'inventory':
          return !customerFilter.sku.includes(product.sku);
        case 'flavorDislikes':
          return (
            !customerFilter.id.includes(product.flavor.id) ||
            nextWantProducts.includes(product)
          );
        case 'allergens':
          for (const allergen of product.allergens) {
            if (
              customerFilter.id.includes(allergen.id) &&
              !nextWantProducts.some((nextWant) => nextWant.id === product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unavailableCookingMethods':
          for (const cookingMethod of product.cookingMethods) {
            if (
              customerFilter.id.includes(cookingMethod.id) &&
              !nextWantProducts.some((nextWant) => nextWant.id === product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'ingredientDislikes':
          for (const ingredient of product.ingredients) {
            if (
              customerFilter.id.includes(ingredient.id) &&
              !nextWantProducts.some((nextWant) => nextWant.id === product.id)
            ) {
              return false;
            }
          }
          return true;
        case 'unwanted':
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
  }: GetSuggestionArgs): Promise<[GetSuggestionRes?, Error?]> {
    let isFirstOrder = false;
    const [lastCustomerOrder, getLastCustomerOrderError] =
      await this.shipheroRepository.getLastCustomerOrder({ email: customer.email });
    if (getLastCustomerOrderError) {
      return [undefined, getLastCustomerOrderError];
    }
    if (lastCustomerOrder.products.length === 0) {
      isFirstOrder = true;
    }
    const [[scores, getAverageScoresError], [nextWantProducts, getNextWantError], [nextUnwantedProducts, getCustomerUnwantedError]]
    =
    !isFirstOrder
      ? await Promise.all(
        [this.customerPreferenceRepository.getAverageScores({ email: customer.email }), this.customerPreferenceRepository.getNextWant({ orderNumber: lastCustomerOrder.orderNumber }), this.customerPreferenceRepository.getNextUnwanted({ email: customer.email })])
      : [[], [], []];

    if (getAverageScoresError) {
      return [undefined, getAverageScoresError];
    }
    if (getNextWantError) {
      return [undefined, getNextWantError];
    }
    if (getCustomerUnwantedError) {
      return [undefined, getCustomerUnwantedError];
    }

    const [
      [customerMedicalCondition, getCustomerMedicalConditionError],
      [noInventoryProducts, getNoInventoryProductsError],
      [customerFlavorDislikes, customerFlavorDislikesError],
      [customerAllergens, customerAllergensError],
      [customerUnavailableCookingMethods, customerUnavailableCookingMethodsError],
      [customerCategoryPreferences, customerCategoryPreferencesError],
      [customerIngredientDislikes, customerIngredientDislikesError],
    ] = await Promise.all([
      this.customerGeneralRepository.getCustomerMedicalCondition({ email: customer.email }),
      this.shipheroRepository.getNoInventoryProducts(),
      this.customerGeneralRepository.getCustomerPreference({
        email: customer.email,
        type: 'flavorDislikes',
      }),
      this.customerGeneralRepository.getCustomerPreference({
        email: customer.email,
        type: 'allergens',
      }),
      this.customerGeneralRepository.getCustomerPreference({
        email: customer.email,
        type: 'unavailableCookingMethods',
      }),
      this.customerGeneralRepository.getCustomerPreference({
        email: customer.email,
        type: 'categoryPreferences',
      }),
      this.customerGeneralRepository.getCustomerPreference({
        email: customer.email,
        type: 'ingredients',
      }),
    ]);

    if (getCustomerMedicalConditionError) {
      return [undefined, getCustomerMedicalConditionError];
    }

    const [displayAnalyzeProducts, getDisplayAnalyzeProductsError] =
      await this.productGeneralRepository.getAllProducts({ medicalConditions: customerMedicalCondition });
    if (getDisplayAnalyzeProductsError) {
      return [undefined, getDisplayAnalyzeProductsError];
    }
    let allProducts: DisplayAnalyzeProduct[] = displayAnalyzeProducts.sort(
      () => Math.random() - 0.5,
    );

    if (getNoInventoryProductsError) {
      return [undefined, getNoInventoryProductsError];
    }
    if (noInventoryProducts.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'inventory',
        customerFilter: {
          sku: noInventoryProducts.map(({ sku }) => {
            return sku;
          }),
        },
        products: allProducts,
      });
    }

    if (customerFlavorDislikesError) {
      return [undefined, customerFlavorDislikesError];
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
      return [undefined, customerAllergensError];
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
      return [undefined, customerUnavailableCookingMethodsError];
    }
    if (customerUnavailableCookingMethods.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'unavailableCookingMethods',
        customerFilter: customerUnavailableCookingMethods,
        products: allProducts,
        nextWantProducts,
      });
    }

    if (customerIngredientDislikesError) {
      return [undefined, customerIngredientDislikesError];
    }
    if (customerIngredientDislikes.id.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'ingredientDislikes',
        customerFilter: customerIngredientDislikes,
        products: allProducts,
        nextWantProducts,
      });
    }

    if (customerCategoryPreferencesError) {
      return [undefined, customerCategoryPreferencesError];
    }

    if (nextUnwantedProducts && nextUnwantedProducts.length > 0) {
      // FYI: How a SKU is composed
      // XXXX-YYYY-ZZZZ
      // (Product Number) - (Product Category) - (Product Vendor)
      const unwantedVendors: string[] = nextUnwantedProducts.map(({ sku }) => {
        return sku.split('-')[2];
      });
      const unwantedAllProducts: Product[] = allProducts
        .filter(({ sku }) => {
          return unwantedVendors.includes(sku.split('-')[2]);
        })
        .map(products => products);

      allProducts = this.filterProducts({
        filterType: 'unwanted',
        customerFilter: {
          id: unwantedAllProducts.map(({ id }) => {
            return id;
          }),
        },
        products: allProducts,
        nextWantProducts,
      });
    }
    const allCategories = [
      // 25,
      // 3,
      // 6, inactive categories
      10,
      11,
      13,
      14,
      15,
      17,
      18,
      19,
      26,
      4,
      7,
    ];
    const favoriteCategories = customerCategoryPreferences.id.length
      ? customerCategoryPreferences.id
      : allCategories; // when nothing is selected, choose all the categories
    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responses: productCount,
      products: [],
      user_fav_categories: favoriteCategories,
    };
    const nextBoxProducts: GetSuggestionRes = { products: [] };

    for (const product of allProducts) {
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
          for (const lastSentProduct of lastCustomerOrder.products) {
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
      necessary_responses: productCount - nextBoxProducts.products.length,
    };
    let [analyzedProductsRes, analyzedProductsError] =
      await this.analyzePreferenceRepository.getAnalyzedProducts(
        customerShippableProducts,
      );
    if (analyzedProductsRes.is_success === 'false') {
      customerShippableProducts.user_fav_categories.push(
        allCategories[0], // Chocolate
        allCategories[1], // Cookie/Brownie
        allCategories[2], // Meal Shake
      );
      [analyzedProductsRes, analyzedProductsError] =
        await this.analyzePreferenceRepository.getAnalyzedProducts(
          customerShippableProducts,
        );
    }
    if (analyzedProductsError) {
      return [undefined, analyzedProductsError];
    }
    for (const product of allProducts) {
      for (const analyzedProduct of analyzedProductsRes.products) {
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

    return [nextBoxProducts, undefined];
  }
}
