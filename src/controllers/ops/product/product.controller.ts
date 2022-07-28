import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpsertProductUsecaseInterface } from '@Usecases/product/upsertProduct.usecase';
import { UpsertProductDto } from './dtos/upsertProduct';
import { Product } from '@Domains/Product';

@Controller('api/ops')
export class ProductController {
  constructor(
    @Inject('UpsertProductUsecaseInterface')
    private upsertProductUsecaseInterface: UpsertProductUsecaseInterface,
  ) {}
  @Post('product')
  async upsertProduct(
    @Body() body: UpsertProductDto,
    @Res() response: Response<Product | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.upsertProductUsecaseInterface.upsertProduct(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }
}
