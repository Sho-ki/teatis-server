import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Inject, Injectable } from "@nestjs/common";
import { KlaviyoRepositoryInterface } from "@Repositories/klaviyo/klaviyo.repository";
import { Status } from '@Domains/Status';

interface DeleteCustomerInformationInterface {
  email: string;
  serverSideUrl: string;
}
export interface DeleteEmailUsecaseInterface {
  deleteUserInformation({email, serverSideUrl}:DeleteCustomerInformationInterface ): Promise<[Status?, Error?]>;
}

@Injectable()
export class DeleteEmailUsecase implements DeleteEmailUsecaseInterface {
  constructor(
    @Inject('KlaviyoRepositoryInterface')
    private klaviyoRepository: KlaviyoRepositoryInterface
  ){}
  async deleteUserInformation({email, serverSideUrl}: DeleteCustomerInformationInterface): Promise<[Status?, Error?]> {
    const [, error] = await this.klaviyoRepository.deleteUserInformation({email, serverSideUrl});
    if(error){
      return [undefined, error]
    }
    return [{success:true}];
  }
}
