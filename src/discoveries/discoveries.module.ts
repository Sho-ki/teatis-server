import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
import { TypeFormRepostitory } from '../repositories/typeform/typeformRepo';
import { PrismaService } from '../prisma.service';

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
