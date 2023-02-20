/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';
import { EmployeeCustomer } from '../../domains/EmployeeCustomer';
import { ReturnValueType } from '../../filter/customError';
import { ShipheroRepositoryInterface } from '../../repositories/shiphero/shiphero.repository';
import { CustomerEventLogRepositoryInterface } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { EmployeeRepositoryInterface } from '../../repositories/teatisDB/employee/employee.repository';
import { MonthlySelectionRepositoryInterface } from '../../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import { getDateTimeString, yyyyLLLddss } from '../utils/dates';

export interface CreateEmployeeOrderUsecaseInterface {
  createEmployeeOrder(): Promise<ReturnValueType<EmployeeCustomer[]>>;
}

@Injectable()
export class CreateEmployeeOrderUsecase implements CreateEmployeeOrderUsecaseInterface {
  private createEmployeeOrderErrors:Error[] = [];

  constructor(
    @Inject('EmployeeRepositoryInterface')
    private readonly employeeRepository: EmployeeRepositoryInterface,
    @Inject('MonthlySelectionRepositoryInterface')
    private monthlySelectionRepository: MonthlySelectionRepositoryInterface,
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('CustomerProductsAutoSwapInterface')
    private customerProductsAutoSwap: CustomerProductsAutoSwapInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('CustomerEventLogRepositoryInterface')
    private customerEventLogRepository: CustomerEventLogRepositoryInterface,

  ) {}

  async createEmployeeOrder(): Promise<ReturnValueType<EmployeeCustomer[]>> {
    const [employeeCustomers] = await this.employeeRepository.
      getActiveEmployeeCustomersForOrder({ monthlyOrderInterval: 1 });

    const [monthlyBoxSelection] = await this.monthlySelectionRepository.getMonthlySelection({ date: new Date(), boxPlan: 'standard' });

    for(const employeeCustomer of employeeCustomers) {
      try{
      // eslint-disable-next-line prefer-const
        let [boxProducts, swapError] =
            await this.customerProductsAutoSwap.customerProductsAutoSwap(
              {
                products: monthlyBoxSelection.products,
                customer: employeeCustomer,
                count: monthlyBoxSelection.products.length,
              }
            );

        if (!boxProducts.length || swapError) {
          boxProducts =  monthlyBoxSelection.products;
        }

        const requiredShipDate = getDateTimeString(48);
        const holdUntilDate = getDateTimeString(24);

        const [productOnHand] = await this.shipheroRepository.createCustomerOrder(
          {
            firstName: employeeCustomer.firstName,
            lastName: employeeCustomer.lastName,
            email: employeeCustomer.email,
            orderNumber: `${employeeCustomer.employee.employer.name}-${employeeCustomer.employee.id}-${yyyyLLLddss()}`,
            address: employeeCustomer.customerAddress,
            warehouseCode: 'CLB-DB',
            uuid: employeeCustomer.uuid,
            products: boxProducts,
            requiredShipDate,
            holdUntilDate,
          });

        const fiveOrLessStocks = productOnHand.filter(val => val.onHand <= 5);

        const inactivateTarget = fiveOrLessStocks.filter(({ sku }) => {
          return !sku.includes('mini')||!sku.includes('standard')||!sku.includes('box');
        });
        if(inactivateTarget.length){
          await this.productGeneralRepository.updateProductsStatus(
            {
              activeStatus: 'inactive',
              skus: inactivateTarget.map(({ sku }) => { return sku; }),
            }
          );

        }

        await this.customerEventLogRepository.createCustomerEventLog({ customerId: employeeCustomer.id, event: 'boxOrdered' });
      }catch(e){
        this.createEmployeeOrderErrors.push({
          name: 'createEmployeeOrderError',
          message: e.message,
        });
      }
    }

    if(this.createEmployeeOrderErrors.length){
      console.log('createEmployeeOrderErrors: ', this.createEmployeeOrderErrors);
      throw {
        code: 500,
        details: { getCustomerDataErrorStack: this.createEmployeeOrderErrors },
      };
    }

    employeeCustomers.forEach((employeeCustomer) => { return delete employeeCustomer.customerAddress; });
    return [employeeCustomers];

  }
}

