import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';

interface DeleteCustomerInformationInterface {
  email: string;
  serverSideUrl: string;
}
export interface DeleteEmailUsecaseInterface {
  deleteUserInformation({ email, serverSideUrl }:DeleteCustomerInformationInterface ): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class DeleteEmailUsecase implements DeleteEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({ email, serverSideUrl }: DeleteCustomerInformationInterface):
  Promise<ReturnValueType<Status>> {
    const [, error] = await this.klaviyoRepository.deleteUserInformation({ email, serverSideUrl });
    if(error){
      return [undefined, error];
    }
    return [{ success: true }];
  }
}
