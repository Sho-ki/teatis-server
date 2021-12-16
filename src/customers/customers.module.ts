import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { ShopifyRepo } from 'src/repositories/shopify/shopifyRepo';
import { TypeFormRepostitory } from 'src/repositories/typeform/typeformRepo';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    TypeFormRepostitory,
    ShopifyRepo,
    GetRecommendProductsUseCase,
    PrismaService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
