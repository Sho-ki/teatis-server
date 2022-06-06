import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreatePractitionerUsecaseInterface } from '../../../usecases/practitioner/createPractitioner.usecase';
import { CreatePractitionerDto } from '../dtos/createPractitioner';
import { Response } from 'express';
import { GetPractitionerDto } from '../dtos/getPractitioner';
import { GetPractitionerUsecaseInterface } from '../../../usecases/practitioner/getPractitioner.usecase';

@Controller('api/discovery')
export class PractitionerController {
  constructor(
    @Inject('CreatePractitionerUsecaseInterface')
    private createPractitionerUsecase: CreatePractitionerUsecaseInterface,
    @Inject('GetPractitionerUsecaseInterface')
    private getPractitionerUsecase: GetPractitionerUsecaseInterface,
  ) {}

  @Post('practitioner')
  async postPractitioner(
    @Body() body: CreatePractitionerDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.createPractitionerUsecase.createPractitioner(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }
  @Get('practitioner')
  async getPractitioner(
    @Query() body: GetPractitionerDto,
    @Res() response: Response,
  ) {
    const [res, error] = await this.getPractitionerUsecase.getPractitioner(
      body,
    );
    if (error && error.name !== 'Not found') {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }
}