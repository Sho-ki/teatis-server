import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeFormRepostitory } from 'src/repositories/typeform/TypeformRepo';
import { GetRecommendProductsUseCase } from 'src/userCases/getRecommendProductsByReposeId';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, TypeFormRepostitory, GetRecommendProductsUseCase],
})
export class UsersModule {}
