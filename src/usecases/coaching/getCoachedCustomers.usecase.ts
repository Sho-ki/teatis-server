import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomerList } from '@Domains/TwilioCustomerList';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';

export interface GetCoachedCustomersUsecaseInterface {
  getCoachedCustomers(email:string, oldCursorId:number): Promise<ReturnValueType<TwilioCustomerList>>;
}

@Injectable()
export class GetCoachedCustomersUsecase
implements GetCoachedCustomersUsecaseInterface
{
  constructor(
    @Inject('CoachRepositoryInterface')
    private coachedCustomerRepository: CoachRepositoryInterface,
  ) {}

  async getCoachedCustomers(email:string, oldCursorId :number): Promise<ReturnValueType<TwilioCustomerList>> {
    const [coachedCustomers, getCoachedCustomersError] =
      await this.coachedCustomerRepository.getCoachedCustomers({ email, oldCursorId });

    if (getCoachedCustomersError) {
      return [undefined, getCoachedCustomersError];
    }

    const twilioCustomers:TwilioCustomerList = coachedCustomers.length ?
      {
        objects: {
          customers: coachedCustomers.map(({ id, phone, coach, note, firstName, lastName }) => {
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
          }),
        },
      }
      :{ objects: { customers: [] } };

    return [twilioCustomers, undefined];
  }
}
