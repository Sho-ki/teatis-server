import { Inject, Injectable } from '@nestjs/common';
import { KlaviyoRepositoryInterface } from '@Repositories/klaviyo/klaviyo.repository';
import { ReturnValueType } from '../../filter/customerError';

interface PostCustomerInformationInterface {
  email: string;
  customerUuid: string;
  recommendBoxType: string;
  serverSideUrl: string;
}
export interface PostEmailUsecaseInterface {
  postCustomerInformation({ email, customerUuid, recommendBoxType, serverSideUrl }: PostCustomerInformationInterface): Promise<ReturnValueType<void>>;
}

@Injectable()
export class PostEmailUsecase implements PostEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation({ email, customerUuid, recommendBoxType, serverSideUrl }: PostCustomerInformationInterface): Promise<ReturnValueType<void>> {
    const [_, response] = await this.klaviyoRepository.postCustomerInformation({ email, customerUuid, recommendBoxType, serverSideUrl });
    if(response){
      return [undefined, response];
    }
    return [_];
  }
}
