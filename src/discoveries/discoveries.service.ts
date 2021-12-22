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
    if (!typeformId) throw new Error('Something went wrong');
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
    } = await this.getRecommendProductsUseCase
      .getRecommendProducts(typeformId)
      .catch(() => {
        throw new Error('Something went wrong');
      });

    const isDiscoveryExist = await this.checkIfExists(typeformId).catch(() => {
      throw new Error('Something went wrong');
    });
    if (isDiscoveryExist) {
      return { recommendProductData };
    }

    const insertQuery = `INSERT INTO ${bqTableName} VALUES(
                       '${email}', 
                       '${typeformId}',
                        ${BMR}, 
                        ${carbsMacronutrients}, ${proteinMacronutrients}, ${fatMacronutrients}, 
                        ${carbsPerMeal}, ${proteinPerMeal}, ${fatPerMeal}, ${caloriePerMeal}) `;
    await bigquery.query(insertQuery).catch(() => {
      throw new Error('Something went wrong');
    });
    return { recommendProductData };
  }

  private async checkIfExists(typeform_id: string): Promise<boolean> {
    const getQuery = `SELECT typeform_id FROM ${bqTableName} WHERE typeform_id='${typeform_id}'`;
    const findDiscoveryByTypeformId = await bigquery
      .query(getQuery)
      .catch(() => {
        throw new Error('Something went wrong');
      });
    return findDiscoveryByTypeformId[0].length ? true : false;
  }
}
