import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { Url } from '../../domains/Url';
import { TerraRepositoryInterface } from '@Repositories/terra/terra.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';

export interface UpsertAllCustomersGlucoseUsecaseInterface {
  upsertAllCustomersGlucose(): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class UpsertAllCustomersGlucoseUsecase
implements UpsertAllCustomersGlucoseUsecaseInterface
{
  constructor(
    @Inject('TerraRepositoryInterface')
    private readonly terraRepository: TerraRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async upsertAllCustomersGlucose(): Promise<ReturnValueType<Url>> {

    const all = (body.data.map((val) => { return val.glucose_data.blood_glucose_samples.map(({ timestamp }) => timestamp); }));

    const [terraCustomers, getAllCustomersError] = await this.terraRepository.getAllCustomers();
    if(getAllCustomersError){
      return [undefined, getAllCustomersError];
    }

    const allCustomerLogs = await Promise.all(terraCustomers.map(({ terraCustomerId }) => {
      this.terraRepository;
    }));
    return [terraAuthUrl];
  }
}
