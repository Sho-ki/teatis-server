import { Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import axios from 'axios';
import { GetCustomerProfileResponse } from './googleOAuth2.interface';
import { GoogleOAuthCustomer } from '../../domains/GoogleOAuthCustomer';

export interface GetCustomerProfileArgs {
  accessToken: string;
}

export interface GoogleOAuth2RepositoryInterface {
  getCustomerProfile({ accessToken }: GetCustomerProfileArgs): Promise<ReturnValueType<GoogleOAuthCustomer>>;
}

@Injectable()
export class GoogleOAuth2Repository implements GoogleOAuth2RepositoryInterface {

  async getCustomerProfile({ accessToken }: GetCustomerProfileArgs): Promise<ReturnValueType<GoogleOAuthCustomer>>{
    const response = await axios.get<GetCustomerProfileResponse.CustomerProfile>(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    if (response.status !== 200) return [undefined, { name: 'getCustomerProfile', message: 'getCustomerProfile failed' }];
    const { email, name, given_name, family_name, picture, locale } = response.data;
    return [{ email, name, givenName: given_name, familyName: family_name, picture, locale }];
  }
}
