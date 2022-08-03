import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";

interface DeleteCustomerInformationInterface {
  email: string;
  serverSideUrl: string;
}
export interface DeleteEmailUsecaseInterface {
  deleteUserInformation({email, serverSideUrl}:DeleteCustomerInformationInterface ): Promise<[void, Error]>;
}

@Injectable()
export class DeleteEmailUsecase implements DeleteEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({email, serverSideUrl}: DeleteCustomerInformationInterface): Promise<[void, Error]> {
    const [_, response] = await this.klaviyoRepository.deleteUserInformation({email, serverSideUrl});
    return [_, response];
  }
}
