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
import { Prisma } from '@prisma/client';

import { CreatePractitionerBoxDto } from '../dtos/createPractitionerBox';
import { CreatePractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetAllPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/getAllPractitionerBoxes.usecase';
import { GetAllProductsUsecaseInterface } from '@Usecases/product/getAllProducts.usecase';
import { GetPractitionerBoxByLabelUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { GetPractitionerBoxDto } from '../dtos/getPractitionerBox';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { UpdateRecurringPractitionerBoxDto } from '../dtos/updateRecurringPractitionerBox';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';

@Controller('api/discovery')
export class PractitionerBoxController {
  constructor(
    @Inject('GetPractitionerBoxByUuidUsecaseInterface')
    private getPractitionerBoxByUuidUsecase: GetPractitionerBoxByUuidUsecaseInterface,
    @Inject('CreatePractitionerBoxUsecaseInterface')
    private createPractitionerBoxUsecase: CreatePractitionerBoxUsecaseInterface,
    @Inject('GetPractitionerBoxByLabelUsecaseInterface')
    private getPractitionerBoxByLabelUsecase: GetPractitionerBoxByLabelUsecaseInterface,
    @Inject('GetAllPractitionerBoxesUsecaseInterface')
    private getAllPractitionerBoxesUsecase: GetAllPractitionerBoxesUsecaseInterface,
    @Inject('UpdateRecurringPractitionerBoxesUsecaseInterface')
    private updateRecurringPractitionerBoxesUsecase: UpdateRecurringPractitionerBoxesUsecaseInterface,
    @Inject('GetAllProductsUsecaseInterface')
    private getAllProductsUsecase: GetAllProductsUsecaseInterface,

  ) {}

  // Get: api/discovery/practitioner-box
  @Get('practitioner-box')
  async getPractitionerBox(
    @Query()
      query: GetPractitionerBoxDto,
    @Res() response: Response<PractitionerAndBox | Error>,
  ) {
    let [usecaseResponse, error]: [PractitionerAndBox, Error] = [undefined, undefined];

    if (query.practitionerBoxUuid) {
      [usecaseResponse, error] =
        await this.getPractitionerBoxByUuidUsecase.getPractitionerBoxByUuid(
          query,
        );
    } else if (query.email && query.label) {
      [usecaseResponse, error] =
        await this.getPractitionerBoxByLabelUsecase.getPractitionerBoxByLabel(
          query,
        );
    }

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // Post: api/discovery/practitioner-box
  @Post('practitioner-box')
  async createPractitionerBox(
    @Body() body: CreatePractitionerBoxDto,
    @Res() response: Response<PractitionerAndBox | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.createPractitionerBoxUsecase.createPractitionerBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // POST: api/discovery/practitioner-box/update-recurring-practitioner-box
  @Post('practitioner-box/update-recurring-practitioner-box')
  async updateRecurringPractitionerBox(
    @Body() body: UpdateRecurringPractitionerBoxDto,
    @Res() response: Response<(Prisma.BatchPayload | PractitionerBox)[] | Error>,
  ){
    const [usecaseResponse, error] =
      await this.updateRecurringPractitionerBoxesUsecase.aaa(body);
    if (error) return response.status(500).send(error);
    return response.status(200).send(usecaseResponse);
  }
}
