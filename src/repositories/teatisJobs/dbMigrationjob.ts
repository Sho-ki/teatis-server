import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Discoveries,
  Customer,
  CustomerNutritionItem,
} from '@prisma/client';
import { PrismaService } from '../../prisma.service';

interface TeatisJobsInterface {
  databaseMigrate(): void;
}

@Injectable()
export class TeatisJobs implements TeatisJobsInterface {
  constructor(private prisma: PrismaService) {}
  async databaseMigrate(): Promise<void> {
    const AllDiscoveries = await this.prisma.discoveries.findMany({});
    for (let i = 1500; i < AllDiscoveries.length; i++) {
      await this.prisma.$queryRaw`
    with first_insert as (
        insert into public."Customer"(email)
        values(${AllDiscoveries[i]['email']})
        RETURNING id
     )
     insert into public."CustomerNutrition" (customer_id, customer_nutrition_item_id ,nutrition_value)
     values
     ( (select id from first_insert),(1),  ${AllDiscoveries[i]['BMR']}),
     ( (select id from first_insert),(2),  ${AllDiscoveries[i]['carbs_macronutrients']}),
     ( (select id from first_insert),(3),  ${AllDiscoveries[i]['protein_macronutrients']}),
     ( (select id from first_insert),(4),  ${AllDiscoveries[i]['fat_macronutrients']}),
     ( (select id from first_insert),(5),  ${AllDiscoveries[i]['carbs_per_meal']}),
     ( (select id from first_insert),(6),  ${AllDiscoveries[i]['protein_per_meal']}),
     ( (select id from first_insert),(7),  ${AllDiscoveries[i]['fat_per_meal']}),
     ( (select id from first_insert),(8),  ${AllDiscoveries[i]['calorie_per_meal']});
    `;
    }
  }
}
