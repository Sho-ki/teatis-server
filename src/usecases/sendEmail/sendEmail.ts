import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

export interface EmailUsecaseInterface {
  postCustomerInformation({email, customerUuid, recommendBoxType, klaviyoListName}: PostCustomerInformationDto): Promise<[void, Error]>;
  deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]>;
}

@Injectable()
export class EmailUsecase implements EmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postCustomerInformation({email, customerUuid, recommendBoxType, klaviyoListName}: PostCustomerInformationDto): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.postCustomerInformation({email, customerUuid, recommendBoxType, klaviyoListName});
    return [_, response];
  }
  async deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({email,klaviyoListName});
    return [_, response];
  }
}
