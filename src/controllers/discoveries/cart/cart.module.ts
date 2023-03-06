import { Module } from '@nestjs/common';
import { CreateCheckoutCartUsecase } from '../../../usecases/checkoutCart/createCheckoutCart.usecase';

import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [
    {
      provide: 'CreateCheckoutCartUsecaseInterface',
      useClass: CreateCheckoutCartUsecase,
    },
    CartController,
  ],
  exports: [CartController],
})
export class CartModule {}
