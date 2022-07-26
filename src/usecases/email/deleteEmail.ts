import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';

interface DeleteCustomerInformationArgs {
  email: string;
  serverSideUrl: string;
}
export interface DeleteEmailUsecaseInterface {
  deleteUserInformation({ email, serverSideUrl }:DeleteCustomerInformationArgs ): Promise<[void, Error]>;
}

@Injectable()
export class DeleteEmailUsecase implements DeleteEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({ email, serverSideUrl }: DeleteCustomerInformationArgs): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({ email, serverSideUrl });
    return [_, response];
  }
}
