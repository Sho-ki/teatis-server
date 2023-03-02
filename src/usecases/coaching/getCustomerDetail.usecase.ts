import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomerDetail } from '@Domains/TwilioCustomerDetail';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';

export interface GetCustomerDetailUsecaseInterface {
  getCustomerDetail(id:number): Promise<ReturnValueType<TwilioCustomerDetail>>;
}

@Injectable()
export class GetCustomerDetailUsecase
implements GetCustomerDetailUsecaseInterface
{
  constructor(
    @Inject('CoachRepositoryInterface')
    private coachedCustomerRepository: CoachRepositoryInterface,
  ) {}

  async getCustomerDetail(id:number): Promise<ReturnValueType<TwilioCustomerDetail>> {
    const [customerDetail, getCustomerDetailError] =
      await this.coachedCustomerRepository.getCustomerDetail({ id });

    if (getCustomerDetailError) {
      return [undefined, getCustomerDetailError];
    }

    const { phone, coach,  firstName, lastName } = customerDetail;
    let displayName = `customer ${id}`;
    if(firstName && lastName) displayName = `${firstName} ${lastName}`;
    else if(firstName) displayName = firstName;

    const twilioCustomers:TwilioCustomerDetail =
      {
        objects: {
          customer: {
            customer_id: id,
            display_name: displayName,
            channels: [{ type: 'sms', value: phone }],
            details: {
              title: 'Customer note',
              content: 'https://teatis.retool.com/apps/2829cca0-b105-11ed-99eb-3bd869f39c7b/Customer%20question%20responses?uuid=' + customerDetail.uuid,
            },
            worker: coach.email, // assign this customer to a worker
            address: phone,
          },

        },
      };

    return [twilioCustomers, undefined];
  }
}
