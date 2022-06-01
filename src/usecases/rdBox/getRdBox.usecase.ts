import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { GetRdBoxDto } from '@Controllers/discoveries/dtos/getRdBox';

export interface GetRdBoxUsecaseInterface {
  getRdBox({ rdBoxId }: GetRdBoxDto): Promise<[Status, Error]>;
}

@Injectable()
export class GetRdBoxUsecase implements GetRdBoxUsecaseInterface {
  constructor(
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('CustomerBoxRepoInterface')
    private customerBoxRepo: CustomerBoxRepoInterface,
  ) {}
  getRdBox({ rdBoxId }: GetRdBoxDto): Promise<[Status, Error]> {
    throw new Error('Method not implemented.');
  }
}
