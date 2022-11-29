import { Injectable } from '@nestjs/common';
import * as ClientOAuth2 from 'client-oauth2';

import { ReturnValueType } from '@Filters/customError';
import { Url } from '@Domains/Url';
import { googleBaseOptions } from '../../utils/OAuthBaseOptions';

interface GetOAuthUriArgs {
  uuid:string;
}

export interface GetOAuthUriUsecaseInterface {
  getUri({ uuid }: GetOAuthUriArgs): ReturnValueType<Url>;
}

@Injectable()
export class GetOAuthUriUsecase
implements GetOAuthUriUsecaseInterface
{
  getUri({ uuid }: GetOAuthUriArgs): ReturnValueType<Url> {
    const client = new ClientOAuth2({
      ...googleBaseOptions,
      state: uuid,
    });
    return [{ url: client.code.getUri() }];
  }
}

