import { PostUserInformationDto } from "@Controllers/discoveries/dtos/postUserInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

export interface EmailUsecaseInterface {
  postUserInfo({email, customerUuid, recommendBoxType, klaviyoListName}: PostUserInformationDto): Promise<[void, Error]>;
}

@Injectable()
export class EmailUsecase implements EmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postUserInfo({email, customerUuid, recommendBoxType, klaviyoListName}: PostUserInformationDto): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.postUserInfo({email, customerUuid, recommendBoxType, klaviyoListName});
    return [_, response];
  }
}
