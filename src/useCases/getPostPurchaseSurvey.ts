import { Injectable } from '@nestjs/common';

import { ShipheroRepo } from '../repositories/shiphero/shipheroRepo';
import { GetProductDetailQuery } from '../repositories/shiphero/generated/graphql';

export interface GetLastOrderUseCaseInterface {
  getPostPurchaseSurvey(email: string): Promise<GetProductDetailQuery[]>;
}

@Injectable()
export class GetLastOrderUseCase implements GetLastOrderUseCaseInterface {
  constructor(private shipheroRepo: ShipheroRepo) {}
  async getPostPurchaseSurvey(email: string): Promise<GetProductDetailQuery[]> {
    const data: GetProductDetailQuery[] =
      await this.shipheroRepo.getLastOrderProductsByEmail(email);

    console.log('data', data);
    return data;
  }
}
