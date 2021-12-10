import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
require('dotenv').config();

import { CreateUserInfoDto } from './dtos/create-user.dto';
import { Users } from './users.entity';
import { GetRecommendProductsUseCase } from '../userCases/getRecommendProductsByReposeId';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
  ) {}

  async createUser(body: CreateUserInfoDto) {
    const recommendProducts =
      await this.getRecommendProductsUseCase.getRecommendProducts(
        body.userResponseId,
      );
  }
}
