import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerCoachRepositoryInterface } from '../../repositories/teatisDB/coach/customerCoach.repository';
import { TwilioCustomer } from '../../domains/TwilioCustomer';

export interface GetCoachCustomersUsecaseInterface {
  getCoachCustomers(email:string): Promise<ReturnValueType<TwilioCustomer[]>>;
}

@Injectable()
export class GetCoachCustomersUsecase
implements GetCoachCustomersUsecaseInterface
{
  constructor(
    @Inject('CustomerCoachRepositoryInterface')
    private customerCoachRepository: CustomerCoachRepositoryInterface,
  ) {}

  async getCoachCustomers(email:string): Promise<ReturnValueType<TwilioCustomer[]>> {
    const [customerCoach, getCustomerCoachError] =
      await this.customerCoachRepository.getCustomerCoach({ email });

    if (getCustomerCoachError) {
      return [undefined, getCustomerCoachError];
    }

    const twilioCustomers:TwilioCustomer[] = customerCoach.length ?
      customerCoach.map(({ id, phone, coach, note, firstName, lastName }) => {
        let displayName = `customer ${id}`;
        if(firstName && lastName) displayName = `${firstName} ${lastName}`;
        else if(firstName) displayName = firstName;
        return {
          customer_id: id,
          display_name: displayName,
          channels: [{ type: 'sms', value: phone }],
          details: {
            title: 'Customer note',
            content: note,
          },
          worker: coach.email, // assign this customer to a worker
          address: phone,
        };
      }):[];

    return [twilioCustomers, undefined];
  }
}
