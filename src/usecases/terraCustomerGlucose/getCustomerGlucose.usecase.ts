import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TerraCustomerRepositoryInterface } from '../../repositories/teatisDB/terraCustomer/terraCustomer.repository';
import { GetCustomerDeviceRequestDto } from '../../controllers/v2/customers/dtos/GetCustomerDevice.dto';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { GlucoseLogsDto } from '../../controllers/ResponseDtos/GlucoseLogs.dto';

export interface GetCustomersGlucoseUsecaseInterface {
  execute({ uuid }: GetCustomerDeviceRequestDto): Promise<ReturnValueType<GlucoseLogsDto>>;
}

@Injectable()
export class GetCustomersGlucoseUsecase
implements GetCustomersGlucoseUsecaseInterface
{
  constructor(
    @Inject('TerraCustomerRepositoryInterface')
    private readonly terraCustomerRepository: TerraCustomerRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,

  ) {}

  async execute({ uuid }: GetCustomerDeviceRequestDto): Promise<ReturnValueType<GlucoseLogsDto>> {
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }
    const [terraCustomer, getTerraCustomerError] = await
    this.terraCustomerRepository.getCustomerGlucoseLogsByCustomerId({ customerId: customer.id });

    if(getTerraCustomerError){
      return [undefined, getTerraCustomerError];
    }

    const response: GlucoseLogsDto = { glucoseLogs: terraCustomer.terraCustomerLog };

    return [response];

  }
}
