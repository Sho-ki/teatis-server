import { Inject, Injectable } from '@nestjs/common';

import { CreateTeatisBoxDto } from '@Controllers/discoveries/dtos/createTeatisBox';
import { ReturnValueType } from '@Filters/customError';
import { TeatisBox } from '@Domains/TeatisBox';
import { TeatisBoxRepositoryInterface } from '@Repositories/teatisDB/teatis/teatisBox.repository';

export interface CreateTeatisBoxUsecaseInterface {
  createTeatisBox({
    products,
    label,
    description,
    note,
  }: CreateTeatisBoxDto): Promise<ReturnValueType<TeatisBox>>;
}

@Injectable()
export class CreateTeatisBoxUsecase
implements CreateTeatisBoxUsecaseInterface
{
  constructor(
    @Inject('TeatisBoxRepositoryInterface')
    private teatisBoxRepository: TeatisBoxRepositoryInterface,
  ) {}
  async createTeatisBox({
    products,
    label,
    description,
    note,
  }: CreateTeatisBoxDto): Promise<ReturnValueType<TeatisBox>> {

    const [teatisBoxProduct, createTeatisBoxProductError] =
      await this.teatisBoxRepository.createTeatisBox({
        label,
        products,
        description,
        note,
      });
    if(createTeatisBoxProductError){ return [undefined, createTeatisBoxProductError]; }

    return [teatisBoxProduct, undefined];
  }
}
