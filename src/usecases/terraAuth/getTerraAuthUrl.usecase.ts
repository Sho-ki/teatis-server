import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { Url } from '../../domains/Url';
import { TerraRepositoryInterface } from '@Repositories/terra/terra.repository';

export interface GetTerraAuthUrlUsecaseInterface {
  getTerraAuthUrl(uuid:string): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class GetTerraAuthUrlUsecase
implements GetTerraAuthUrlUsecaseInterface
{
  constructor(
 @Inject('TerraRepositoryInterface')
    private readonly terraRepositoryInterface: TerraRepositoryInterface,
  ) {}

  async getTerraAuthUrl(uuid:string): Promise<ReturnValueType<Url>> {
    const [terraAuthUrl, getAuthUrlError] = await this.terraRepositoryInterface.getAuthUrl({ uuid, resource: 'FREESTYLELIBRE', successUrl: '', failureUrl: '' });
    if(getAuthUrlError){
      return [undefined, getAuthUrlError];
    }
    return [terraAuthUrl];
  }
}
