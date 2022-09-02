import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ReturnValueType } from '../../filter/customError';
import { Url } from '../../domains/Url';
import { GetAllCustomersResponse, GetTerraAuthUrlRequest, GetTerraAuthUrlResponse } from './terra.interface';
import { TerraCustomer } from '../../domains/TerraCustomer';

export interface GetAuthUrlArgs {
  uuid: string;
  resource:'FREESTYLELIBRE';
  successUrl:string;
  failureUrl:string;
}

export interface TerraRepositoryInterface {
  getAuthUrl({ uuid }: GetAuthUrlArgs): Promise<ReturnValueType<Url>>;
  getAllCustomers():Promise<ReturnValueType<TerraCustomer[]>>;
  getCustomerGlucoseLog():Promise<ReturnValueType<TerraCustomer[]>>;
}

@Injectable()
export class TerraRepository implements TerraRepositoryInterface {
  async getAuthUrl({ uuid, resource, successUrl, failureUrl }: GetAuthUrlArgs): Promise<ReturnValueType<Url>> {
    const requestArguments:GetTerraAuthUrlRequest =  {
      resource,
      reference_id: uuid,
      auth_success_redirect_url: successUrl,
      auth_failure_redirect_url: failureUrl,
    };

    const { data, status } = await axios.post<GetTerraAuthUrlResponse>('https://api.tryterra.co/v2/auth/authenticateUser',
      requestArguments,
      {
        headers: {
          'Content-Type': 'application/json',
          'dev-id': process.env.TERRA_DEV_ID,
          'x-api-key': process.env.TERRA_API_KEY,
        },
      } );
    if(status !== 200) {
      return [undefined, { name: data.status, message: data.message }];
    }
    return [{ url: data.auth_url }];
  }

  async getAllCustomers():Promise<ReturnValueType<TerraCustomer[]>>{
    const { data, status } = await axios.get<GetAllCustomersResponse>('https://api.tryterra.co/v2/subscriptions',
      {
        headers: {
          'Content-Type': 'application/json',
          'dev-id': process.env.TERRA_DEV_ID,
          'x-api-key': process.env.TERRA_API_KEY,
        },
      } );
    if(status !== 200) {
      return [undefined, { name: data.status, message: 'No terraCustomer is found' }];
    }
    const customers:TerraCustomer[] = data.users.map(({ user_id, provider }) => {
      return { terraCustomerId: user_id, provider };
    });
    return [customers];
  }

  async getCustomerGlucoseLog({ terraCustomerId }){

  }
}
