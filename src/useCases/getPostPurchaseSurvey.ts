import { Injectable } from '@nestjs/common';

import { ShipheroRepo } from '../repositories/shiphero/shipheroRepo';
import { GetItemDetailQuery } from '../repositories/shiphero/generated/graphql';

export interface GetLastOrderUseCaseInterface {
  getPostPurchaseSurvey(email: string): Promise<GetItemDetailQuery[]>;
}

@Injectable()
export class GetLastOrderUseCase implements GetLastOrderUseCaseInterface {
  constructor(private shipheroRepo: ShipheroRepo) {}
  async getPostPurchaseSurvey(email: string): Promise<GetItemDetailQuery[]> {
    const data: GetItemDetailQuery[] =
      await this.shipheroRepo.getLastOrderItemsByEmail(email);
    return data;
  }
}
