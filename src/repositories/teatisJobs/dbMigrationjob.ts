import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Discoveries,
  Customer,
  CustomerNutritionItem,
} from '@prisma/client';
import { PrismaService } from '../../prisma.service';

interface TeatisJobsInterface {
  getTagertData(): Promise<Object[]>;
  applyToNewDB(AllDiscoveries: Object[]): Promise<Object>;
}

@Injectable()
export class TeatisJobs implements TeatisJobsInterface {
  constructor(private prisma: PrismaService) {}
  async getTagertData(): Promise<Object[]> {
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

    // ,
    //  second_insert as (
    //    insert into public."CustomerNutritionItem"(description ,label)
    //    values
    //    ( 'BMR', 'BMR') on conflict(label) do update set label='BMR'
    //    RETURNING id
    //  )
    return AllDiscoveries;
  }
  async applyToNewDB(AllDiscoveries: Object[]): Promise<Object> {
    let data: any = [];
    for (let discovery of AllDiscoveries) {
      console.log(discovery);
      data.push({
        email: discovery['email'],
      });
    }
    await this.prisma.$queryRaw`
   
   `;
    return AllDiscoveries;
  }

  //   customer_nutrition_items: {
  //     create: [
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['BMR'],
  //           },
  //         },
  //         nutrition_value: BMR,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['carbsMacronutrients'],
  //           },
  //         },
  //         nutrition_value: carbsMacronutrients,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['proteinMacronutrients'],
  //           },
  //         },
  //         nutrition_value: proteinMacronutrients,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['fatMacronutrients'],
  //           },
  //         },
  //         nutrition_value: fatMacronutrients,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['carbsPerMeal'],
  //           },
  //         },
  //         nutrition_value: carbsPerMeal,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['proteinPerMeal'],
  //           },
  //         },
  //         nutrition_value: proteinPerMeal,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['fatPerMeal'],
  //           },
  //         },
  //         nutrition_value: fatPerMeal,
  //       },
  //       {
  //         customer_nutrition_item: {
  //           connect: {
  //             id: retrieveAllCustomerNutritionItems['caloriePerMeal'],
  //           },
  //         },
  //         nutrition_value: caloriePerMeal,
  //       },
  //     ],
  //   },
  //   async createDiscovery({
  //     email,
  //     BMR,
  //     carbsMacronutrients,
  //     proteinMacronutrients,
  //     fatMacronutrients,
  //     carbsPerMeal,
  //     proteinPerMeal,
  //     fatPerMeal,
  //     caloriePerMeal,
  //     retrieveAllCustomerNutritionItems,
  //   }): Promise<Customer> {
  //     const data: Prisma.CustomerCreateInput = {
  //       email,
  //       customer_nutrition_items: {
  //         create: [
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['BMR'],
  //               },
  //             },
  //             nutrition_value: BMR,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['carbsMacronutrients'],
  //               },
  //             },
  //             nutrition_value: carbsMacronutrients,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['proteinMacronutrients'],
  //               },
  //             },
  //             nutrition_value: proteinMacronutrients,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['fatMacronutrients'],
  //               },
  //             },
  //             nutrition_value: fatMacronutrients,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['carbsPerMeal'],
  //               },
  //             },
  //             nutrition_value: carbsPerMeal,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['proteinPerMeal'],
  //               },
  //             },
  //             nutrition_value: proteinPerMeal,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['fatPerMeal'],
  //               },
  //             },
  //             nutrition_value: fatPerMeal,
  //           },
  //           {
  //             customer_nutrition_item: {
  //               connect: {
  //                 id: retrieveAllCustomerNutritionItems['caloriePerMeal'],
  //               },
  //             },
  //             nutrition_value: caloriePerMeal,
  //           },
  //         ],
  //       },
  //     };
  //     return await this.prisma.customer.create({ data });
  //   }
}
