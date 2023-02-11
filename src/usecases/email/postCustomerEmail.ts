import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';

interface PostCustomerInformationInterface {
  email: string;
  customerUuid: string;
  serverSideUrl: string;
}
export interface PostEmailUsecaseInterface {
  postCustomerInformation({ email, customerUuid, serverSideUrl }: PostCustomerInformationInterface):
  Promise<ReturnValueType<Status>>;
}

@Injectable()
export class PostEmailUsecase implements PostEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation(
    { email, customerUuid, serverSideUrl }: PostCustomerInformationInterface):
  Promise<ReturnValueType<Status>> {
    const [, error] = await this.klaviyoRepository.postCustomerInformation(
      { email, customerUuid, serverSideUrl });
    if(error){
      return [undefined, error];
    }
    return [{ success: true }];
  }
}
