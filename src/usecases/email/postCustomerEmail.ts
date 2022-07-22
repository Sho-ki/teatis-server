import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

interface PostCustomerInformationInterface {
  email: string;
  customerUuid: string;
  recommendBoxType: string;
  serverSideUrl: string;
}
export interface PostEmailUsecaseInterface {
  postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationInterface): Promise<[void, Error]>;
}

@Injectable()
export class PostEmailUsecase implements PostEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationInterface): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl});
    return [_, response];
  }
}
