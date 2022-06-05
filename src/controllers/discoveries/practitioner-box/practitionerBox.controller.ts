import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { GetPractitionerBoxDto } from '../dtos/getPractitionerBox';
import { Response } from 'express';
import { GetPractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBox.usecase';
import { CreatePractitionerDto } from '../dtos/createPractitioner';
import { CreatePractitionerUsecaseInterface } from '../../../usecases/practitioner/createPractitioner.usecase';
import { CreatePractitionerBoxDto } from '../dtos/createPractitionerBox';
import { CreatePractitionerBoxUsecaseInterface } from '../../../usecases/practitionerBox/createPractitionerBox.usecase';

@Controller('api/discovery')
export class PractitionerBoxController {
  constructor(
    @Inject('GetPractitionerBoxUsecaseInterface')
    private getPractitionerBoxUsecase: GetPractitionerBoxUsecaseInterface,
    @Inject('CreatePractitionerBoxUsecaseInterface')
    private createPractitionerBoxUsecase: CreatePractitionerBoxUsecaseInterface,
  ) {}

  // Get: api/discovery/customer-nutrition
  @Get('practitioner-box')
  async getPractitionerBox(
    @Query() body: GetPractitionerBoxDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.getPractitionerBoxUsecase.getPractitionerBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // Get: api/discovery/customer-nutrition
  @Post('practitioner-box')
  async createPractitionerBox(
    @Body() body: CreatePractitionerBoxDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.createPractitionerBoxUsecase.createPractitionerBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }
}
