import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
import { TypeFormRepo } from '../repositories/typeform/typeformRepo';
import { PrismaService } from '../prisma.service';
import { DiscoveriesRepo } from '../repositories/teatisDB/customerRepo/discoveriesRepo';
import { TeatisJobs } from '../repositories/teatisJobs/dbMigrationjob';
import { ShipheroRepo } from '../repositories/shiphero/shipheroRepo';
import { GetLastOrderUseCase } from '../useCases/getPostPurchaseSurvey';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    DiscoveriesService,
    TypeFormRepo,
    ShopifyRepo,
    DiscoveriesRepo,
    ShipheroRepo,
    GetRecommendProductsUseCase,
    GetLastOrderUseCase,
    PrismaService,
    TeatisJobs,
  ],
  exports: [DiscoveriesService],
})
export class DiscoveriesModule {}
