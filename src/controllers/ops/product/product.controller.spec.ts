import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { UpsertProductUsecaseInterface } from '@Usecases/product/upsertProduct.usecase';
import { Product } from '@Domains/Product';
import { ReturnValueType } from '../../../filter/customerError';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: 'UpsertProductUsecaseInterface',
          useValue: {
            upsertProduct: () =>
              Promise.resolve<ReturnValueType<Product>>([
                {
                  id: 1,
                  name: 'product_test_1',
                  label: 'product 1',
                  sku: 'sku_test',
                },
              ]),
          } as UpsertProductUsecaseInterface,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
