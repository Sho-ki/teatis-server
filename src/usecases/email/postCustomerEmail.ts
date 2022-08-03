import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';

interface PostCustomerInformationInterface {
  email: string;
  customerUuid: string;
  recommendBoxType: string;
  serverSideUrl: string;
}
export interface PostEmailUsecaseInterface {
  postCustomerInformation({ email, customerUuid, recommendBoxType, serverSideUrl }: PostCustomerInformationInterface):
  Promise<ReturnValueType<Status>>;
}

@Injectable()
export class PostEmailUsecase implements PostEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation(
    { email, customerUuid, recommendBoxType, serverSideUrl }: PostCustomerInformationInterface):
  Promise<ReturnValueType<Status>> {
    const [, error] = await this.klaviyoRepository.postCustomerInformation(
      { email, customerUuid, recommendBoxType, serverSideUrl });
    if(error){
      return [undefined, error];
    }
    return [{ success: true }];
  }
}
