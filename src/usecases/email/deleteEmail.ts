import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';
import { ReturnValueType } from '../../filter/customerError';

interface DeleteCustomerInformationArgs {
  email: string;
  serverSideUrl: string;
}
export interface DeleteEmailUsecaseInterface {
  deleteUserInformation({ email, serverSideUrl }:DeleteCustomerInformationArgs ): Promise<ReturnValueType<void>>;
}

@Injectable()
export class DeleteEmailUsecase implements DeleteEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({ email, serverSideUrl }: DeleteCustomerInformationArgs):Promise<ReturnValueType<void>> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({ email, serverSideUrl });
    if(response){
      return [undefined, response];
    }
    return [_];
  }
}
