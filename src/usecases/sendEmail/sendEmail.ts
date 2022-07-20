import { PostUserInformationDto } from "@Controllers/discoveries/dtos/postUserInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

export interface EmailUsecaseInterface {
  postUserInformation({email, customerUuid, recommendBoxType, klaviyoListName}: PostUserInformationDto): Promise<[void, Error]>;
  deleteUserInformation({email, klaviyoListName}: Partial<PostUserInformationDto>): Promise<[void, Error]>;
}

@Injectable()
export class EmailUsecase implements EmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async postUserInformation({email, customerUuid, recommendBoxType, klaviyoListName}: PostUserInformationDto): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.postUserInformation({email, customerUuid, recommendBoxType, klaviyoListName});
    return [_, response];
  }
  async deleteUserInformation({email, klaviyoListName}: Partial<PostUserInformationDto>): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({email,klaviyoListName});
    return [_, response];
  }
}
