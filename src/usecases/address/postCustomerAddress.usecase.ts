import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomerList } from '@Domains/TwilioCustomerList';
import { PostCustomerProfileDto } from '../../controllers/discoveries/profile/dtos/postCustomerProfile.dto';

export interface PostCustomerProfileInterface {
  postCustomerProfile(
    body: PostCustomerProfileDto,
  ): Promise<ReturnValueType<TwilioCustomerList>>;
}

@Injectable()
export class PostCustomerProfile implements PostCustomerProfileInterface {
  constructor(

  ) {}

  async postCustomerProfile({
    customerId,
    address1,
    address2,
    city,
    zip,
    country,
    phoneNumber,
    state,
    firstName,
    lastName,
  }: PostCustomerProfileDto): Promise<ReturnValueType<unknown>> {}
}
