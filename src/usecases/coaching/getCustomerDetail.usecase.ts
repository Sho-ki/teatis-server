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
              content: 'customer ID: ' + customerDetail.uuid,
            },
            worker: coach.email, // assign this customer to a worker
            address: phone,
          },

        },
      };

    return [twilioCustomers, undefined];
  }
}
