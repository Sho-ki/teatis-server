import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProductGeneralRepo } from '../../../repositories/teatisDB/productRepo/productGeneral.repository';
import { UpsertProductUsecase } from '../../../usecases/product/upsertProduct.usecase';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  exports: [ProductController],
  providers: [
    {
      provide: 'ProductGeneralRepoInterface',
      useClass: ProductGeneralRepo,
    },
    {
      provide: 'UpsertProductUsecaseInterface',
      useClass: UpsertProductUsecase,
    },
    ProductController,
    PrismaService,
  ],
})
export class ProductModule {}
