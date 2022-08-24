import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateTeatisBoxDto } from '@Controllers/discoveries/dtos/createTeatisBox';
import { TeatisBox } from '@Domains/TeatisBox';
import { CreateTeatisBoxUsecaseInterface } from '@Usecases/teatisBox/createTeatisBox.usecase';

@Controller('api/discovery')
export class TeatisBoxController {
  constructor(
    @Inject('CreateTeatisBoxUsecaseInterface')
    private createTeatisBoxUsecase: CreateTeatisBoxUsecaseInterface,
  ) {}

  // Post: api/discovery/teatis-box
  @Post('teatis-box')
  async createTeatisBox(
    @Body() body: CreateTeatisBoxDto,
    @Res() response: Response<TeatisBox | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.createTeatisBoxUsecase.createTeatisBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }
}
