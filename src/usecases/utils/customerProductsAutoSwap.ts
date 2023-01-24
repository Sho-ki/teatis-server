import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import {
  DisplayAnalyzeProduct,
  Product,
} from '@Domains/Product';
import { CustomerPreferenceRepositoryInterface } from '@Repositories/teatisDB/customer/customerPreference.repository';

import { Customer } from '@Domains/Customer';
import { ReturnValueType } from '../../filter/customError';

interface customerProductsAutoSwapArgs {
  customer: Customer;
  products : Product[];
  count:number;
}

interface FilterProductsArgs {
  filterType:
    | 'ingredientDislikes'
    | 'inventory'
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwanted'
    | 'sentLastTime'
;
  customerFilter: { id?: number[], sku?: string[] };
  products: DisplayAnalyzeProduct[];
  nextWantProducts?: Product[];
}

export interface CustomerProductsAutoSwapInterface {
  customerProductsAutoSwap({
    customer,
    products,
    count,

  }: customerProductsAutoSwapArgs): Promise<ReturnValueType<Product[]>>;
}

@Injectable()
export class CustomerProductsAutoSwap implements CustomerProductsAutoSwapInterface {
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
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
        case 'sentLastTime':
          if (
            customerFilter.sku.includes(product.sku) &&
              !nextWantProducts.some((nextWant) => nextWant.sku === product.sku)
          ) {
            return false;
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

  async customerProductsAutoSwap({ customer, products, count }: customerProductsAutoSwapArgs):
  Promise<ReturnValueType<Product[]>> {
    let isFirstOrder = false;
    const [lastCustomerOrder, getLastCustomerOrderError] =
      await this.shipheroRepository.getLastFulfilledOrder({ email: customer.email, uuid: customer.uuid });
    if (getLastCustomerOrderError) {
      return [undefined, getLastCustomerOrderError];
    }
    if (lastCustomerOrder.products.length === 0) {
      isFirstOrder = true;
    }
    const [[nextWantProducts, getNextWantError], [nextUnwantedProducts, getCustomerUnwantedError]]
    =
    !isFirstOrder
      ? await Promise.all(
        [
          this.customerPreferenceRepository.getNextWant(
            { orderNumber: lastCustomerOrder.orderNumber }),
          this.customerPreferenceRepository.getNextUnwanted(
            { email: customer.email }),
        ])
      : [[], [], []];

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
        type: 'ingredients',
      }),
    ]);

    if (getCustomerMedicalConditionError) {
      return [undefined, getCustomerMedicalConditionError];
    }

    const [analyzeProducts, getAnalyzeProductsError] =
      await this.productGeneralRepository.getAllProducts({ medicalConditions: customerMedicalCondition });
    if (getAnalyzeProductsError) {
      return [undefined, getAnalyzeProductsError];
    }
    let allProducts: DisplayAnalyzeProduct[] = analyzeProducts.sort(
      () => Math.random() - 0.5,
    );

    if (lastCustomerOrder.products.length > 0) {
      allProducts = this.filterProducts({
        filterType: 'sentLastTime',
        customerFilter: {
          sku: lastCustomerOrder.products.map(({ sku }) => {
            return sku;
          }),
        },
        products: allProducts,
        nextWantProducts,
      });
    }

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

    const shippableProducts:Product[] = nextWantProducts && nextWantProducts.length > 0
      ? allProducts.filter((product) => {
        return !nextWantProducts.find((nextWant) => nextWant.id === product.id);
      })
      : allProducts;
    const newProducts:Product[] = nextWantProducts? [...nextWantProducts]:[];
    for(const product of products){
      const foundProductIndex = shippableProducts.findIndex(
        shippableProduct => shippableProduct.id === product.id);
      if(foundProductIndex !== -1){
        newProducts.push({
          id: product.id,
          name: product.name,
          label: product.label,
          sku: product.sku,
        });
        shippableProducts.splice(foundProductIndex, 1);
      }else {
        const categoryCode = product.sku.split('-')[1];
        let swapTargetProductIndex = shippableProducts.findIndex(
          shippableProduct => shippableProduct.sku.split('-')[1] === categoryCode);
        if(swapTargetProductIndex === -1) swapTargetProductIndex = 0;
        const switchedProduct = shippableProducts[swapTargetProductIndex];
        newProducts.push({
          id: switchedProduct.id,
          name: switchedProduct.name,
          label: switchedProduct.label,
          sku: switchedProduct.sku,
        });
        shippableProducts.splice(swapTargetProductIndex, 1);
      }
      if(newProducts.length === count) break;
    }
    return [newProducts, undefined];

  }

}
