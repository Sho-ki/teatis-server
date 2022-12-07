import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomer } from '@Domains/TwilioCustomer';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';

export interface GetCoachCustomersUsecaseInterface {
  getCoachCustomers(email:string): Promise<ReturnValueType<TwilioCustomer[]>>;
}

@Injectable()
export class GetCoachCustomersUsecase
implements GetCoachCustomersUsecaseInterface
{
  constructor(
    @Inject('CoachRepositoryInterface')
    private coachCustomerRepository: CoachRepositoryInterface,
  ) {}

  async getCoachCustomers(email:string): Promise<ReturnValueType<TwilioCustomer[]>> {
    const [coachCustomers, getCoachCustomersError] =
      await this.coachCustomerRepository.getCoachCustomers({ email });

    if (getCoachCustomersError) {
      return [undefined, getCoachCustomersError];
    }

    const twilioCustomers:TwilioCustomer[] = coachCustomers.length ?
      coachCustomers.map(({ id, phone, coach, note, firstName, lastName }) => {
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
