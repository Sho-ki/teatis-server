import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ReturnValueType } from '../../filter/customError';
import { Url } from '../../domains/Url';
import { GetAllCustomersResponse, GetTerraAuthUrlRequest, GetTerraAuthUrlResponse, GetCustomerGlucoseLogResponse } from './terra.interface';
import { TerraCustomer } from '../../domains/TerraCustomer';
import { GlucoseLog, GlucoseLogData } from '../../domains/GlucoseLog';

export interface GetAuthUrlArgs {
  uuid: string;
  resource:'FREESTYLELIBRE';
  successUrl:string;
  failureUrl:string;
}

interface GetCustomerGlucoseLogsArgs{
  terraCustomerId:string;
  date:string;
}

export interface TerraRepositoryInterface {
  getAuthUrl({ uuid, resource, successUrl, failureUrl }: GetAuthUrlArgs): Promise<ReturnValueType<Url>>;
  getAllCustomers():Promise<ReturnValueType<TerraCustomer[]>>;
  getCustomerGlucoseLogs({ terraCustomerId, date }:
    GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>;
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

  async getCustomerGlucoseLogs({ terraCustomerId, date }:
    GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>{
    const { data, status } = await axios.get<GetCustomerGlucoseLogResponse.RootObject>(
      `https://api.tryterra.co/v2/body?to_webhook=false&start_date=${date}&user_id=${terraCustomerId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'dev-id': process.env.TERRA_DEV_ID,
          'x-api-key': process.env.TERRA_API_KEY,
        },
      } );
    if(status === 401){
      return [
        {
          terraCustomerKeyId: null,
          terraCustomerId: '',
          data: [],
        },
      ];
    }
    if(status !== 200) {
      throw new Error('Something went wrong with terra');
    }
    const todaysGlucoseData: GlucoseLog ={
      terraCustomerId,
      terraCustomerKeyId: null,
      data: data.data.map(({ glucose_data }):GlucoseLogData[] =>
      { return glucose_data.blood_glucose_samples.map(({ timestamp, blood_glucose_mg_per_dL }) =>
      { return {
        timestampUtc: new Date(timestamp),
        timestamp,
        glucoseValue: blood_glucose_mg_per_dL,
      }; }); }).flatMap(data => data),
    };

    return [todaysGlucoseData];
  }
}
