import { Injectable } from '@nestjs/common';
import * as ClientOAuth2 from 'client-oauth2';

import { ReturnValueType } from '@Filters/customError';
import { Url } from '@Domains/Url';
import { createGoogleOAuthClient } from '@Usecases/utils/OAuthClient';

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
    const client:ClientOAuth2 = createGoogleOAuthClient(uuid);
    return [{ url: client.code.getUri() }];
  }
}

