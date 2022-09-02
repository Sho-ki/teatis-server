import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { MasterMonthlyBox } from '@Domains/MasterMonthlyBox';
import { CreateMasterMonthlyBoxDto } from '@Controllers/discoveries/dtos/createTeatisBox';
import { MasterMonthlyBoxRepositoryInterface } from '@Repositories/teatisDB/masterMonthlyBox/masterMonthlyBox.repository';

export interface CreateMasterMonthlyBoxUsecaseInterface {
  createMasterMonthlyBox({
    products,
    label,
    description,
    note,
  }: CreateMasterMonthlyBoxDto): Promise<ReturnValueType<MasterMonthlyBox>>;
}

@Injectable()
export class CreateMasterMonthlyBoxUsecase
implements CreateMasterMonthlyBoxUsecaseInterface
{
  constructor(
    @Inject('MasterMonthlyBoxRepositoryInterface')
    private masterMonthlyBoxRepository: MasterMonthlyBoxRepositoryInterface,
  ) {}
  async createMasterMonthlyBox({
    products,
    label,
    description,
    note,
  }: CreateMasterMonthlyBoxDto): Promise<ReturnValueType<MasterMonthlyBox>> {

    const [masterMonthlyBoxProduct, createMasterMonthlyBoxProductError] =
      await this.masterMonthlyBoxRepository.createMasterMonthlyBox({
        label,
        products,
        description,
        note,
      });
    if(createMasterMonthlyBoxProductError){ return [undefined, createMasterMonthlyBoxProductError]; }

    return [masterMonthlyBoxProduct, undefined];
  }
}
