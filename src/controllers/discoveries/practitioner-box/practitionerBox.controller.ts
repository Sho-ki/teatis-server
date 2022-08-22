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

import { CreatePractitionerBoxDto } from '../dtos/createPractitionerBox';
import { CreatePractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetAllPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/getAllPractitionerBoxes.usecase';
import { GetAllRecurringPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/getAllRecurringBoxes.usecase';
import { GetPractitionerBoxByLabelUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { GetPractitionerBoxDto } from '../dtos/getPractitionerBox';
import { GetRecurringPractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/getRecurringPractitionerBox.usecase';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { currentMonth, nextMonth, previousMonth } from '@Usecases/utils/dates';
import { UpdateRecurringPractitionerBoxDto } from '../dtos/updateRecurringPractitionerBox';
import { GetAllProductsUsecaseInterface } from '@Usecases/product/getAllProducts.usecase';

@Controller('api/discovery')
export class PractitionerBoxController {
  constructor(
    @Inject('GetPractitionerBoxByUuidUsecaseInterface')
    private getPractitionerBoxByUuidUsecase: GetPractitionerBoxByUuidUsecaseInterface,
    @Inject('CreatePractitionerBoxUsecaseInterface')
    private createPractitionerBoxUsecase: CreatePractitionerBoxUsecaseInterface,
    @Inject('GetPractitionerBoxByLabelUsecaseInterface')
    private getPractitionerBoxByLabelUsecase: GetPractitionerBoxByLabelUsecaseInterface,
    @Inject('GetRecurringPractitionerBoxUsecaseInterface')
    private getRecurringPractitionerBoxUsecase: GetRecurringPractitionerBoxUsecaseInterface,
    @Inject('GetAllRecurringPractitionerBoxesUsecaseInterface')
    private getAllRecurringPractitionerBoxesUsecase: GetAllRecurringPractitionerBoxesUsecaseInterface,
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
    // @Res() response: Response<PractitionerAndBox | Error>,
    @Res() response: Response<unknown>,
  ){
    const [allPractitionerBoxes, allPractitionerBoxesError] =
      await this.getAllPractitionerBoxesUsecase.getAllPractitionerBoxes();
    if (allPractitionerBoxesError) { return response.status(500).send(allPractitionerBoxesError); }

    const [newestRecurringBoxes, newestRecurringBoxesError] =
      await this.updateRecurringPractitionerBoxesUsecase.filterDuplicatePractitionerBox(allPractitionerBoxes);
    if (newestRecurringBoxesError) { return response.status(500).send(newestRecurringBoxesError); }
    const [allProducts, allProductsError] =
      await this.getAllProductsUsecase.getAllProducts(
        {
          medicalConditions:
          {
            highBloodPressure: false,
            highCholesterol: false,
          },
        }
      );
    if (allProductsError) { return response.status(500).send(allProductsError); }
    const productsByCategory = {};
    allProducts.forEach(product => {
      const category = product.sku.split('-')[1];
      if(productsByCategory[category]) {
        productsByCategory[category].push(product);
      } else {
        productsByCategory[category] = [product];
      }
    });
    const [swapTargetProducts, swapTargetProductsError] =
    await this.updateRecurringPractitionerBoxesUsecase.swapTargetProducts(newestRecurringBoxes, body, allProducts);
    if (swapTargetProductsError) { return response.status(500).send(swapTargetProductsError); }

    return response.status(200).send(swapTargetProducts);
  }
}
