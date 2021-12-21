import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.
const bigquery = new BigQuery();
const bqTableName = process.env.BQ_TABLE_NAME;

@Injectable()
export class DiscoveriesService {
  constructor(
    private prisma: PrismaService,
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
  ) {}

  async createDiscovery(body: CreateDiscoveryInfoDto) {
    const typeformId = body.typeformId;
    const {
      recommendProductData,
      email,
      BMR,
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
      carbsPerMeal,
      proteinPerMeal,
      fatPerMeal,
      caloriePerMeal,
    } = await this.getRecommendProductsUseCase.getRecommendProducts(typeformId);

    const isDiscoveryExist = await this.checkIfExists(typeformId);
    if (isDiscoveryExist) {
      return { recommendProductData };
    }

    const insertQuery = `INSERT INTO ${bqTableName} VALUES(
                       '${email}', 
                       '${typeformId}',
                        ${BMR}, 
                        ${carbsMacronutrients}, ${proteinMacronutrients}, ${fatMacronutrients}, 
                        ${carbsPerMeal}, ${proteinPerMeal}, ${fatPerMeal}, ${caloriePerMeal}) `;
    await bigquery.query(insertQuery);
    return { recommendProductData };
  }

  private async checkIfExists(typeform_id: string): Promise<boolean> {
    const getQuery = `SELECT * FROM ${bqTableName} WHERE typeform_id='${typeform_id}'`;
    const findDiscoveryByTypeformId = await bigquery.query(getQuery);
    return findDiscoveryByTypeformId[0].length ? true : false;
  }
}
