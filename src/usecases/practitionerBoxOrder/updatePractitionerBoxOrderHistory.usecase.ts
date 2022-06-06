import { Inject, Injectable } from '@nestjs/common';

import { DeleteCustomerBoxDto } from '@Controllers/discoveries/dtos/deleteCustomerBox';
import { PractitionerBoxOrderHistoryRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBoxOrderHistory.repository';

export interface UpdatePractitionerBoxOrderHistoryUsecaseInterface {
  updatePractitionerOrderHistory({
    name,
  }: DeleteCustomerBoxDto): Promise<[void?, Error?]>;
}

@Injectable()
export class UpdatePractitionerBoxOrderHistoryUsecase
  implements UpdatePractitionerBoxOrderHistoryUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxOrderHistoryRepoInterface')
    private practitionerBoxOrderHistoryRepo: PractitionerBoxOrderHistoryRepoInterface,
  ) {}

  async updatePractitionerOrderHistory({
    name,
  }: DeleteCustomerBoxDto): Promise<[void?, Error?]> {
    try {
      const [_practitioner, getPractitionerError] =
        await this.practitionerBoxOrderHistoryRepo.updatePractitionerBoxOrderHistory(
          {
            orderNumber: name,
            status: 'fulfilled',
          },
        );
      if (getPractitionerError) {
        return [undefined, getPractitionerError];
      }

      return [];
    } catch (e) {
      return [undefined, e];
    }
  }
}
