import { Body, Controller, Inject, Post, Query, Res } from '@nestjs/common';
import { CreatePractitionerUsecaseInterface } from '../../../usecases/practitioner/createPractitioner.usecase';
import { CreatePractitionerDto } from '../dtos/createPractitioner';
import { Response } from 'express';

@Controller('api/discovery')
export class PractitionerController {
  constructor(
    @Inject('CreatePractitionerUsecaseInterface')
    private createPractitionerUsecase: CreatePractitionerUsecaseInterface,
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
}
