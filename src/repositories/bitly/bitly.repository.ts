import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Url } from '../../domains/Url';
import { ReturnValueType } from '../../filter/customError';
import { CreateShorterUrlResponse } from './bitly.interface';

interface CreateShorterUrlArgs {
    url:string;
}

export interface BitlyRepositoryInterface {
    createShorterUrl({ url }: CreateShorterUrlArgs): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class BitlyRepository implements BitlyRepositoryInterface {
  async createShorterUrl({ url }: CreateShorterUrlArgs):Promise<ReturnValueType<Url>> {
    const serverSideUrl = 'https://api-ssl.bitly.com/v4/shorten';
    const response = await axios.post<CreateShorterUrlResponse.RootObject>(serverSideUrl,
      {
        'long_url': url,
        'domain': 'box.teatismeal.com',
        'group_guid': process.env.BITLY_GROUP_ID,
      },
      {
        headers:
        { 'Authorization': process.env.BITLY_API_KEY, 'Content-Type': 'application/json' },
      });
    // if(!response || response.status !== 200){
    //   return [undefined, { name: 'createShorterUrl failed', message: 'You hit the monthly limit' }];
    // }
    return [{ url: response.data.link }];
  }

}
