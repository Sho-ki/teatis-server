import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { GetFirstBoxDto } from '@Controllers/ xdiscoveries/dtos/getFirstBox';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
} from '@Domains/Product';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyzeRepo';

export interface GetFirstBoxRes {
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

export interface GetFirstBoxUsecaseInterface {
  getFirstBox({ uuid }: GetFirstBoxDto): Promise<[GetFirstBoxRes, Error]>;
}

@Injectable()
export class GetFirstBoxUsecase implements GetFirstBoxUsecaseInterface {
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('AnalyzePreferenceRepoInterface')
    private analyzePreferenceRepo: AnalyzePreferenceRepoInterface,
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

  async getFirstBox({
    uuid,
  }: GetFirstBoxDto): Promise<[GetFirstBoxRes, Error]> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomerByUuid({ uuid });
    if (getCustomerError) {
      return [null, getCustomerError];
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
      });
    }

    if (customerCategoryPreferencesError) {
      return [null, customerCategoryPreferencesError];
    }

    const defaultIncludeSkus = [
      'x10245-GUM-SN20102',
      'x10208-CHC-SN20124',
      'x10204-SWT-SN20114',
      'x10230-SOU-SN20135',
      'x10262-COK-SN20113',
      'x10244-SWT-SN20138',
    ];

    const defaultExcludeSkus = [
      'x10249-SHK-SN20143',
      'x10253-SOU-SN20100',
      'x10256-OAT-SN20152',
      'x10231-CHP-SN20116',
      'x10221-CHP-SN20101',
    ];
    const allCategories = [18, 19, 7, 15, 17, 6, 4, 3, 13, 25, 11, 26, 14, 10];
    const favoriteCategories = customerCategoryPreferences.id.length
      ? customerCategoryPreferences.id
      : allCategories; // when nothing is selected, choose all the categories
    let customerShippableProducts: AnalyzePreferenceArgs = {
      necessary_responces: 15 - defaultIncludeSkus.length,
      products: [],
      user_fav_categories: favoriteCategories,
    };
    let nextBoxProducts: GetFirstBoxRes = { products: [] };

    for (let product of allProducts) {
      if (
        defaultIncludeSkus.some(
          (defaultIncludeSku) => defaultIncludeSku === product.sku,
        )
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
      } else if (
        defaultExcludeSkus.some(
          (defaultIncludeSku) => defaultIncludeSku === product.sku,
        )
      ) {
        continue;
      }

      let shippableProduct: CustomerShippableProduct = {
        product_id: product.id,
        product_sku: product.sku,
        flavor_id: product.flavor.id,
        category_id: product.category.id,
        is_sent_1: 0,
        avg_flavor_score: 5,
        avg_category_score: 5,
        vendor_id: product.vendor.id,
      };

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
