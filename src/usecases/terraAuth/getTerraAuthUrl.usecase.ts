import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { Url } from '../../domains/Url';
import { TerraRepositoryInterface } from '@Repositories/terra/terra.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';

export interface GetTerraAuthUrlUsecaseInterface {
  getTerraAuthUrl(uuid:string): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class GetTerraAuthUrlUsecase
implements GetTerraAuthUrlUsecaseInterface
{
  constructor(
    @Inject('TerraRepositoryInterface')
    private readonly terraRepository: TerraRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getTerraAuthUrl(uuid:string): Promise<ReturnValueType<Url>> {
    const [, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const [terraAuthUrl, getAuthUrlError] = await this.terraRepository.getAuthUrl({ uuid, resource: 'FREESTYLELIBRE', successUrl: 'https://app.teatismeal.com/teatis/terra/auth-success', failureUrl: '' });
    if(getAuthUrlError){
      return [undefined, getAuthUrlError];
    }
    return [terraAuthUrl];
  }
}
