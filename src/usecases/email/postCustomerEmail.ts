import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";
import { Status } from '@Domains/Status';

interface PostCustomerInformationInterface {
  email: string;
  customerUuid: string;
  recommendBoxType: string;
  serverSideUrl: string;
}
export interface PostEmailUsecaseInterface {
  postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationInterface): Promise<[Status?, Error?]>;
}

@Injectable()
export class PostEmailUsecase implements PostEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationInterface): Promise<[Status?, Error?]> {
    const [, error] = await this.klaviyoRepository.postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl});
    if(error){
      return [undefined, error]
    }
    return [{success:true}];
  }
}
