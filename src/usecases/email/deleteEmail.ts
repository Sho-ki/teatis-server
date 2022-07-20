import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

export interface EmailUsecaseInterface {
  deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]>;
}

@Injectable()
export class EmailUsecase implements EmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({email,klaviyoListName});
    return [_, response];
  }
}
