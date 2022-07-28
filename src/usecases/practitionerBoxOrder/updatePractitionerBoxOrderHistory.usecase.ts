import { Inject, Injectable } from '@nestjs/common';

import { DeleteCustomerBoxDto } from '@Controllers/discoveries/dtos/deleteCustomerBox';
import { PractitionerBoxOrderHistoryRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { Status } from '@Domains/Status';

export interface UpdatePractitionerBoxOrderHistoryUsecaseInterface {
  updatePractitionerOrderHistory({
    name,
  }: DeleteCustomerBoxDto): Promise<[Status?, Error?]>;
}

@Injectable()
export class UpdatePractitionerBoxOrderHistoryUsecase
  implements UpdatePractitionerBoxOrderHistoryUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxOrderHistoryRepositoryInterface')
    private practitionerBoxOrderHistoryRepository: PractitionerBoxOrderHistoryRepositoryInterface,
  ) {}

  async updatePractitionerOrderHistory({
    name,
  }: DeleteCustomerBoxDto): Promise<[Status?, Error?]> {
    const [_practitioner, getPractitionerError] =
      await this.practitionerBoxOrderHistoryRepository.updatePractitionerBoxOrderHistory(
        {
          orderNumber: name,
          status: 'fulfilled',
        },
      );
    if (getPractitionerError) {
      return [undefined, getPractitionerError];
    }

    return [{success:true}];
  }
}
