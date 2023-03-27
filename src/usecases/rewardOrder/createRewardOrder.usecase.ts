import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { Customer } from '../../domains/Customer';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { ShipheroRepositoryInterface } from '../../repositories/shiphero/shiphero.repository';
import { CustomerEventLogRepositoryInterface } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { MonthlySelectionRepositoryInterface } from '../../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import { ShopifyRepositoryInterface } from '../../repositories/shopify/shopify.repository';
import { CustomerAddressRepositoryInterface } from '../../repositories/teatisDB/customer/customerAddress.repository';
import { RewardItemsRepositoryInterface } from '../../repositories/teatisDB/rewardItem/rewardItem.repository';

export interface CreateRewardOrderUsecaseInterface {
  createRewardOrder(): Promise<
    ReturnValueType<Customer[]>
  >;
}

@Injectable()
export class CreateRewardOrderUsecase
implements CreateRewardOrderUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('MonthlySelectionRepositoryInterface')
    private monthlySelectionRepository: MonthlySelectionRepositoryInterface,
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('ShopifyRepositoryInterface')
    private shopifyRepository: ShopifyRepositoryInterface,
    @Inject('CustomerProductsAutoSwapInterface')
    private customerProductsAutoSwap: CustomerProductsAutoSwapInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('CustomerEventLogRepositoryInterface')
    private customerEventLogRepository: CustomerEventLogRepositoryInterface,
    @Inject('CustomerAddressRepositoryInterface')
    private customerAddressRepository: CustomerAddressRepositoryInterface,
    @Inject('RewardItemsRepositoryInterface')
    private rewardItemsRepository: RewardItemsRepositoryInterface,

  ) {}

  private async registerCustomerAddress(customerId:number, phone:string, firstName:string, lastName:string) {
    const [customerAddress] = await this.shopifyRepository.getCustomerByPhoneNumberOrName(
      {
        phone,
        firstName,
        lastName,
      }
    );

    const [updatedAddress] = await this.customerAddressRepository.upsertCustomerAddress({
      address1: customerAddress.address1,
      address2: customerAddress.address2,
      city: customerAddress.city,
      country: customerAddress.country,
      zip: customerAddress.zip,
      state: customerAddress.state,
      customerId,
    });
    return updatedAddress;
  }

  async createRewardOrder(): Promise<
    ReturnValueType<Customer[]>> {
    return;
    // const [customersWithPointsOverThreshold] =
    // await this.customerGeneralRepository.findCustomersWithPointsOverThreshold(
    //   { pointsThreshold: 900 },
    // );
    // if(customersWithPointsOverThreshold.length === 0) {
    //   return [[]];
    // }

    // const [customersWithAddress] = await this.customerGeneralRepository.getCustomersWithAddress(
    //   { customerIds: customersWithPointsOverThreshold.map(customer => customer.id) }
    // );

    // const [rewardItems] = await this.rewardItemsRepository.getRewardItems({ boxPlan: 'standard' });

    // for(const customer of customersWithAddress) {
    //   try{
    //     if(!customer.customerAddress) {
    //       customer.customerAddress =
    //        await this.registerCustomerAddress(customer.id, customer.phone, customer.firstName, customer.lastName);
    //     }
    //      const productCount = Math.floor(customer.totalPoints / 10); // Divide by 10 and get the productCount
    //      const remainder = customer.totalPoints % 10; // Get the remainder points

    //     // eslint-disable-next-line prefer-const
    //     let [boxProducts, swapError] =
    //         await this.customerProductsAutoSwap.customerProductsAutoSwap(
    //           {
    //             products: rewardItems.map(item => item.product),
    //             customer,
    //             count: productCount
    //           }
    //         );

    //     const requiredShipDate = getDateTimeString(48);
    //     const holdUntilDate = getDateTimeString(24);

    //     const [productOnHand] = await this.shipheroRepository.createCustomerOrder(
    //       {
    //         firstName: customer.firstName,
    //         lastName: customer.lastName,
    //         email: customer.email,
    //         orderNumber: `rewardbox-${customer.}-${customer.employee.id}-${yyyyLLLddss()}`,
    //         address: customer.customerAddress,
    //         warehouseCode: 'CLB-DB',
    //         uuid: customer.uuid,
    //         products: boxProducts,
    //         requiredShipDate,
    //         holdUntilDate,
    //       });

    //     const fiveOrLessStocks = productOnHand.filter(val => val.onHand <= 5);

    //     const inactivateTarget = fiveOrLessStocks.filter(({ sku }) => {
    //       return !sku.includes('mini')||!sku.includes('standard')||!sku.includes('box');
    //     });
    //     if(inactivateTarget.length){
    //       await this.productGeneralRepository.updateProductsStatus(
    //         {
    //           activeStatus: 'inactive',
    //           skus: inactivateTarget.map(({ sku }) => { return sku; }),
    //         }
    //       );

    //     }

    //     await this.customerEventLogRepository.createCustomerEventLog({ customerId: customer.id, event: 'boxOrdered' });
    //   }catch(e){
    //     this.createEmployeeOrderErrors.push({
    //       name: 'createEmployeeOrderError',
    //       message: e.message,
    //     });
    //   }
    // }

    // if(this.createEmployeeOrderErrors.length){
    //   console.log('createEmployeeOrderErrors: ', this.createEmployeeOrderErrors);
    //   throw {
    //     code: 500,
    //     details: { getCustomerDataErrorStack: this.createEmployeeOrderErrors },
    //   };
    // }

  }

}
