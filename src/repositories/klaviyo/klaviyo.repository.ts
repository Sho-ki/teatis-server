import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface PostCustomerInformationArgs {
    email:string;
    customerUuid:string;
    serverSideUrl: string;
}
interface DeleteCustomerInformationArgs {
    email:string;
    serverSideUrl: string;
}
export interface KlaviyoRepositoryInterface {
    postCustomerInformation({ email, customerUuid, serverSideUrl }:
       PostCustomerInformationArgs): Promise<[void, Error]>;
    deleteUserInformation({ email, serverSideUrl }: DeleteCustomerInformationArgs): Promise<[void, Error]>;
}

@Injectable()
export class KlaviyoRepository implements KlaviyoRepositoryInterface {
  async postCustomerInformation({ email, customerUuid, serverSideUrl }:
    PostCustomerInformationArgs): Promise<[void, Error]> {
    if (!serverSideUrl) return [null, { name: 'klaviyo list name not provided', message: 'please provide klaviyo list name' }];
    const userProfiles = { 'profiles': [{ email, customerUuid }] };
    const response = await axios.post(serverSideUrl, userProfiles).catch(error => error);
    if (response.status !== 200) return [null, { name: `${response.name}: Klaviyo postUserInfo`, message: response.message }];
    return [null, null];
  }
  async deleteUserInformation({ email, serverSideUrl }: DeleteCustomerInformationArgs): Promise<[void, Error]> {
    if (!serverSideUrl) return [null, { name: 'klaviyo list name not provided', message: 'please provide klaviyo list name' }];
    const userProfile = { 'emails': [email] };
    const response = await axios.delete(serverSideUrl, { data: userProfile }).catch(error => error);
    if (response.status !== 200) return [null, { name: `${response.name}: Klaviyo deleteUserInformation`, message: response.message }];
    return [null, null];
  }
}
