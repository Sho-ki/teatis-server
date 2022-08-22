import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { UpsertProductUsecase } from '@Usecases/product/upsertProduct.usecase';
import { ProductController } from './product.controller';
import { GetAllProductsUsecase } from '@Usecases/product/getAllProducts.usecase';

@Module({
  controllers: [ProductController],
  exports: [ProductController],
  providers: [
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
    },
    {
      provide: 'UpsertProductUsecaseInterface',
      useClass: UpsertProductUsecase,
    },
    {
      provide: 'GetAllProductsUsecaseInterface',
      useClass: GetAllProductsUsecase,
    },
    ProductController,
    PrismaService,
  ],
})
export class ProductModule {}
