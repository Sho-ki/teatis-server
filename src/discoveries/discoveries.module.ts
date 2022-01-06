import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
import { TypeFormRepo } from '../repositories/typeform/typeformRepo';
import { PrismaService } from '../prisma.service';
import { DiscoveriesRepo } from '../repositories/teatisDB/discoveriesRepo';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    DiscoveriesService,
    TypeFormRepo,
    ShopifyRepo,
    DiscoveriesRepo,
    GetRecommendProductsUseCase,
    PrismaService,
  ],
  exports: [DiscoveriesService],
})
export class DiscoveriesModule {}
