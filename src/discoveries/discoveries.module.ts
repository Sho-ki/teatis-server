import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { ShopifyRepo } from 'src/repositories/shopify/shopifyRepo';
import { TypeFormRepostitory } from 'src/repositories/typeform/typeformRepo';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    DiscoveriesService,
    TypeFormRepostitory,
    ShopifyRepo,
    GetRecommendProductsUseCase,
    PrismaService,
  ],
  exports: [DiscoveriesService],
})
export class DiscoveriesModule {}
