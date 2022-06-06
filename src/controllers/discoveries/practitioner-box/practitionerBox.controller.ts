import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { CreatePractitionerBoxUsecaseInterface } from '../../../usecases/practitionerBox/createPractitionerBox.usecase';
import { PractitionerSingleBox } from '@Domains/PractitionerSingleBox';
import { GetPractitionerBoxByLabelUsecaseInterface } from '../../../usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxDto } from '../dtos/getPractitionerBox';
import { CreatePractitionerBoxDto } from '../dtos/createPractitionerBox';

@Controller('api/discovery')
export class PractitionerBoxController {
  constructor(
    @Inject('GetPractitionerBoxByUuidUsecaseInterface')
    private getPractitionerBoxByUuidUsecase: GetPractitionerBoxByUuidUsecaseInterface,
    @Inject('CreatePractitionerBoxUsecaseInterface')
    private createPractitionerBoxUsecase: CreatePractitionerBoxUsecaseInterface,
    @Inject('GetPractitionerBoxByLabelUsecaseInterface')
    private getPractitionerBoxByLabelUsecase: GetPractitionerBoxByLabelUsecaseInterface,
  ) {}

  // Get: api/discovery/practitioner-box
  @Get('practitioner-box')
  async getPractitionerBox(
    @Query()
    query: GetPractitionerBoxDto,
    @Res() response: Response,
  ) {
    let [res, error]: [PractitionerSingleBox, Error] = [undefined, undefined];

    if (query.practitionerBoxUuid) {
      [res, error] =
        await this.getPractitionerBoxByUuidUsecase.getPractitionerBoxByUuid(
          query,
        );
    } else if (query.email && query.label) {
      [res, error] =
        await this.getPractitionerBoxByLabelUsecase.getPractitionerBoxByLabel(
          query,
        );
    } else {
      return response.status(500).send({ name: 'Invalid query' });
    }

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // Get: api/discovery/practitioner-box
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
