/* eslint-disable array-bracket-newline */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from '../../prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ShipheroRepositoryInterface } from '../shiphero/shiphero.repository';
import axios from 'axios';

interface typeformTmp {
  diabetes: string;
  gender: string;
  height: string;
  weight: string;
  age: string;
  None: string;
  highBloodPressure: string;
  heartDiseases: string;
  highCholesterol: string;
  gastritis: string;
  irritableBowelSyndrome: string;
  chronicKidneyDisease: string;
  gastroesophagealRefluxDisease: string;
  anemia: string;
  hypothyroidism: string;
  hyperthyroidism: string;
  activeLevel: string;
  a1c: string;
  targetA1c: string;
  allergies: string;
  mealShake: string;
  oatmeal: string;
  oatBar: string;
  proteinBar: string;
  cereal: string;
  soup: string;
  'sweet or savory': string;
  email: string;
}

interface KlaviyoArgs {
   profiles: [
        {
        email: string;
        customerUuid:string;
    recommendBoxType:'HC'|'HCLS';
        }
    ];
}

interface TeatisJobsInterface {
  allergenIntegrate(): Promise<void>;
  flavorIntegrate(): Promise<void>;
  databaseMigrate(): Promise<void>;
  addUUID(): Promise<void>;
}

@Injectable()
export class TeatisJobs implements TeatisJobsInterface {
  constructor(
    private prisma: PrismaService,
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
  ) {}

  async allergenIntegrate(): Promise<void> {
    const children = [10,
      16,
      24,
      32];
    const parent = 5;
    const targetName = 'milkAndDairy';
    const targetLabel = 'Milk and Dairy';
    const res = await this.prisma.intermediateCustomerAllergen.findMany(
      {
        where:
        { productAllergenId: parent },
        select: { customer: true },
      });
    console.log(res);
    for(const customer of res){

      await this.prisma.intermediateCustomerAllergen.deleteMany(
        {
          where:
          {
            OR: children.map((id) => {
              return { AND: { productAllergenId: id, customerId: customer.customer.id } }; }),
          },
        });

    }

    const childrenShikaMottenai = await this.prisma.intermediateCustomerAllergen.findMany({
      where: {
        OR: children.map((id) => {
          return { productAllergenId: id  }; }),
      }, select: { customer: true },
    });
    console.log(childrenShikaMottenai);

    await this.prisma.intermediateCustomerAllergen.createMany({
      data: childrenShikaMottenai.map(({ customer }) => { return { customerId: customer.id, productAllergenId: 5 }; }),
      skipDuplicates: true,
    });
    await this.prisma.intermediateCustomerAllergen.deleteMany(
      {
        where:
          {
            OR: children.map((id) => {
              return { productAllergenId: id }; }),
          },
      });

    const resPro = await this.prisma.intermediateProductAllergen.findMany(
      {
        where:
        { productAllergenId: parent },
        select: { product: true },
      });
    console.log(resPro);
    for(const product of resPro){

      await this.prisma.intermediateProductAllergen.deleteMany(
        {
          where:
          {
            OR: children.map((id) => {
              return { AND: { productAllergenId: id, productId: product.product.id } }; }),
          },
        });

    }

    const childrenShikaMottenaiPro = await this.prisma.intermediateProductAllergen.findMany({
      where: {
        OR: children.map((id) => {
          return { productAllergenId: id  }; }),
      }, select: { product: true },
    });
    console.log(childrenShikaMottenaiPro);

    await this.prisma.intermediateProductAllergen.createMany({
      data: childrenShikaMottenaiPro.map(({ product }) => { return { productId: product.id, productAllergenId: 5 }; }),
      skipDuplicates: true,
    });
    await this.prisma.intermediateProductAllergen.deleteMany(
      {
        where:
          {
            OR: children.map((id) => {
              return { productAllergenId: id }; }),
          },
      });

    await this.prisma.productAllergen.deleteMany({ where: { OR: children.map((id) => { return { id }; }) } });
    await this.prisma.productAllergen.update(
      { where: { id: parent }, data: { name: targetName, label: targetLabel } });

  }

  async flavorIntegrate(): Promise<void> {
    const children = [
      'Matcha', 'Mocha Latte',
    ];
    const parent = 'Mocha';
    const targetName ='bitter';
    const targetLabel ='Bitter';

    const parentId = await this.prisma.productFlavor.findFirst({ where: { label: parent } });
    console.log(parentId);
    const resPro = await this.prisma.productFlavor.findMany(
      {
        where:
        { OR: children.map((label) => { return  { label }; })  },
        select: { id: true },
      });

    const res = await this.prisma.intermediateCustomerFlavorDislike.findMany(
      {
        where:
        { productFlavor: { label: parent } },
        select: { customer: true },
      });
    for(const customer of res){
      await this.prisma.intermediateCustomerFlavorDislike.deleteMany(
        {
          where:
          {
            OR: children.map((label) => {
              return { AND: { productFlavor: { label }, customerId: customer.customer.id } }; }),
          },
        });

    }

    const childrenShikaMottenai = await this.prisma.intermediateCustomerFlavorDislike.findMany({
      where: {
        OR: children.map((label) => {
          return { productFlavor: { label }  }; }),
      }, select: { customer: true },
    });
    console.log(childrenShikaMottenai);

    await this.prisma.intermediateCustomerFlavorDislike.createMany({
      data: childrenShikaMottenai.map((
        { customer }) => { return { productFlavorId: parentId.id, customerId: customer.id }; }),
      skipDuplicates: true,
    });

    await this.prisma.intermediateCustomerFlavorDislike.deleteMany(
      {
        where:
          {
            OR: children.map((label) => {
              return { productFlavor: { label } }; }),
          },
      });

    await this.prisma.product.updateMany(
      {
        where: { OR: resPro.map((val) => { return { productFlavorId: val.id }; }) },
        data: { productFlavorId: parentId.id },
      });

    await this.prisma.productFlavor.deleteMany({ where: { OR: children.map((label) => { return { label }; }) } });
    await this.prisma.productFlavor.update(
      { where: { id: parentId.id }, data: { name: targetName, label: targetLabel } });
  }

  async storeUuidInKlaviyo():Promise<any>{
    for(let i = 0; i < 5000; i += 100){
      const customers = await this.prisma.customers.findMany({
        where: { id: { lte: i+99, gte: i } },
        select: {
          id: true,
          email: true,
          uuid: true,
          intermediateCustomerMedicalConditions: { where: { customerMedicalConditionId: 6 } },
        },
      });

      const args = { profiles: [] };

      for(const customer of customers){
        const recommendBoxType =
      customer.intermediateCustomerMedicalConditions.length?'HCLS':'HC';
        args.profiles.push({
          email: customer.email,
          customerUuid: customer.uuid,
          recommendBoxType,
        });
      }

      await axios.post( `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`, args).catch(error => error);
    }
  }

  async getCustomerBox(): Promise<any> {
    const customerPref = await this.prisma.customers.findMany({
      where: {
        OR: [// email
        ].map((email) => {
          return { email };
        }),
      },
      select: {
        id: true,
        email: true,
        intermediateCustomerCategoryPreferences: { select: { productCategory: { select: { name: true } } } },
      },
    });

    const customerInfo = [];
    for (const customer of customerPref) {
      const [dataSet, err] = await this.shipheroRepository.getCustomerOrders({ email: customer.email });

      const orderInfo = [];
      for (const orderData of dataSet) {
        const productBySku = await this.prisma.product.findMany({
          where: {
            OR: orderData.products.map((product) => {
              return { externalSku: product.sku };
            }),
          },
          select: { name: true, productCategory: { select: { name: true } } },
        });
        orderInfo.push({
          shipDate: orderData.orderDate,
          sentProducts: productBySku.map((product) => {
            return {
              name: product.name,
              category: product.productCategory.name,
            };
          }),
        });
      }
      const customerOrders = {
        customerId: customer.id,
        customerCategory: customer.intermediateCustomerCategoryPreferences.map(
          (e) => {
            return e.productCategory.name;
          },
        ),
        ...orderInfo,
      };
      customerInfo.push(customerOrders);
    }

    return customerInfo;
  }

  async addUUID(): Promise<void> {
    let count = 0;
    const emailList = [];

    console.log(emailList.length);
    for (const email of emailList) {
      const res = await this.prisma.customers.findUnique({ where: { email } });
      if (!res?.email) {
        count += 1;
      }
      console.log(email);
    }
    console.log(count);
  }

  async databaseMigrate(): Promise<void> {
    const data = JSON.parse(fs.readFileSync('./defaultData/tmp.json', 'utf8'));

    const customer: typeformTmp[] = data.data.slice();

    for (const cu of customer) {
      console.log(cu);
      let gender = cu.gender;
      if (gender === 'Non binary') {
        gender = 'nonBinary';
      }
      if (gender === 'Male') {
        gender = 'male';
      }
      if (gender === 'Female') {
        gender = 'female';
      }
      const age = Number(cu.age) || 50;
      let height = Number(cu.height) || 55;
      let weight = Number(cu.weight) || 170;
      if (height < 10) {
        height *= 12;
        height = Math.round(height * 2.54 * 10); // inches to cm
        height /= 10;
      } else if (height < 100) {
        height = Math.round(height * 2.54 * 10); // inches to cm
        height /= 10;
      }

      weight = Math.round(weight * 0.453592 * 10); // lb to kg
      weight /= 10;

      let BMR: number;
      if (gender === 'male') {
        BMR = Math.round(
          66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age,
        );
      } else {
        // if female or no answer
        BMR = Math.round(
          655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age,
        );
      }

      let carbsMacronutrients: number;
      let proteinMacronutrients: number;
      let fatMacronutrients: number;
      let activeLevel: string =
        cu.activeLevel || 'Moderately active (1-2 times per week)';

      switch (activeLevel) {
        case 'Very active (3-4 times per week)':
          carbsMacronutrients = Math.round((BMR * 0.45) / 4);
          proteinMacronutrients = Math.round((BMR * 0.35) / 4);
          fatMacronutrients = Math.round((BMR * 0.2) / 4);
          activeLevel = 'veryActive';
          break;
        case 'Moderately active (1-2 times per week)':
          carbsMacronutrients = Math.round((BMR * 0.4) / 4);
          proteinMacronutrients = Math.round((BMR * 0.35) / 4);
          fatMacronutrients = Math.round((BMR * 0.25) / 4);
          activeLevel = 'moderatelyActive';
          break;
        case 'Not active':
          carbsMacronutrients = Math.round((BMR * 0.35) / 4);
          proteinMacronutrients = Math.round((BMR * 0.35) / 4);
          fatMacronutrients = Math.round((BMR * 0.3) / 4);
          activeLevel = 'notActive';
          break;
        default:
          // if no answer
          carbsMacronutrients = Math.round((BMR * 0.4) / 4);
          proteinMacronutrients = Math.round((BMR * 0.35) / 4);
          fatMacronutrients = Math.round((BMR * 0.25) / 4);
          break;
      }

      const carbsPerMeal = Math.round(carbsMacronutrients * 0.25);
      const proteinPerMeal = Math.round(proteinMacronutrients * 0.25);
      const fatPerMeal = Math.round(fatMacronutrients * 0.25);
      const caloriePerMeal = Math.round(BMR * 0.25);

      const medicalConditionsObj = {
        highBloodPressure: cu.highBloodPressure,
        heartDiseases: cu.heartDiseases,
        highCholesterol: cu.highCholesterol,
        gastritis: cu.gastritis,
        irritableBowelSyndrome: cu.irritableBowelSyndrome,
        chronicKidneyDisease: cu.chronicKidneyDisease,
        gastroesophagealRefluxDisease: cu.gastroesophagealRefluxDisease,
        anemia: cu.anemia,
        hypothyroidism: cu.hypothyroidism,
        hyperthyroidism: cu.hyperthyroidism,
      };

      let diabetes: string = cu.diabetes;
      if (cu.diabetes === '' || cu.diabetes.includes('not')) {
        diabetes = 'unknown';
      }
      if (cu.diabetes.includes('loved')) {
        diabetes = 'For A Loved One';
      }

      let a1c: string = cu.a1c;
      if (cu.a1c === '' || cu.a1c.includes('know')) {
        a1c = 'unknown';
      }

      let targetA1c: string = cu.targetA1c;
      if (cu.targetA1c === '' || cu.targetA1c.includes('know')) {
        targetA1c = 'unknown';
      }

      const mediKeys = Object.keys(medicalConditionsObj);
      const filteredMediArr = mediKeys.filter((key) => {
        return medicalConditionsObj[key] !== '';
      });
      const mediQuery = [
        {
          medicalConditionValue: a1c,
          customerMedicalCondition: {
            connectOrCreate: {
              where: { name: 'A1c' },
              create: { name: 'A1c', label: 'A1c' },
            },
          },
        },
        {
          medicalConditionValue: diabetes,
          customerMedicalCondition: {
            connectOrCreate: {
              where: { name: 'diabetes' },
              create: { name: 'diabetes', label: 'Diabetes' },
            },
          },
        },
      ];
      for (const medi of filteredMediArr) {
        mediQuery.push({
          medicalConditionValue: 'yes',
          customerMedicalCondition: {
            connectOrCreate: {
              where: { name: medi },
              create: { name: medi, label: medicalConditionsObj[medi] },
            },
          },
        });
      }

      const cateObj = {
        mealShake: cu.mealShake,
        oatmeal: cu.oatmeal,
        oatBar: cu.oatBar,
        proteinBar: cu.proteinBar,
        cereal: cu.cereal,
        soup: cu.soup,
      };
      const cateObjKeys = Object.keys(cateObj);
      const filteredCateArr = cateObjKeys.filter((key) => {
        return cateObj[key] !== '';
      });

      const cateQuery = [];
      for (const cate of filteredCateArr) {
        cateQuery.push({
          productCategory: {
            connectOrCreate: {
              where: { name: cate },
              create: { name: cate, label: cateObj[cate] },
            },
          },
        });
      }

      if (cu['sweet or savory'] === 'Sweet') {
        cateQuery.push({
          productCategory: {
            connectOrCreate: {
              where: { name: 'sweets' },
              create: { name: 'sweets', label: 'Sweets' },
            },
          },
        });
      }
      console.log(cu.allergies);
      const alleQuery = [];
      if (
        cu.allergies.includes('tree nut') ||
        cu.allergies.includes('Tree nut')
      ) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'treeNuts' },
              create: { name: 'treeNuts', label: 'Tree nuts' },
            },
          },
        });
      }
      if (cu.allergies.includes('egg') || cu.allergies.includes('Egg')) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'eggs' },
              create: { name: 'eggs', label: 'Eggs' },
            },
          },
        });
      }
      if (cu.allergies.includes('milk') || cu.allergies.includes('Milk')) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'milk' },
              create: { name: 'milk', label: 'Milk' },
            },
          },
        });
      }
      if (
        cu.allergies.includes('seafood') ||
        cu.allergies.includes('Seafood')
      ) {
        alleQuery.push(
          {
            productAllergen: {
              connectOrCreate: {
                where: { name: 'fish' },
                create: { name: 'fish', label: 'Fish' },
              },
            },
          },
          {
            productAllergen: {
              connectOrCreate: {
                where: { name: 'crustaceanShellfish' },
                create: {
                  name: 'crustaceanShellfish',
                  label: 'Crustacean shellfish',
                },
              },
            },
          },
        );
      } else if (
        cu.allergies.includes('fish') ||
        cu.allergies.includes('Fish')
      ) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'fish' },
              create: { name: 'fish', label: 'Fish' },
            },
          },
        });
      } else if (
        cu.allergies.includes('shellfish') ||
        cu.allergies.includes('Shellfish')
      ) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'crustaceanShellfish' },
              create: {
                name: 'crustaceanShellfish',
                label: 'Crustacean shellfish',
              },
            },
          },
        });
      }
      if (cu.allergies.includes('peanut') || cu.allergies.includes('Peanuts')) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'peanuts' },
              create: { name: 'peanuts', label: 'Peanuts' },
            },
          },
        });
      }
      if (cu.allergies.includes('wheat') || cu.allergies.includes('Wheat')) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'wheat' },
              create: { name: 'wheat', label: 'Wheat' },
            },
          },
        });
      }
      if (cu.allergies.includes('soy') || cu.allergies.includes('Soy')) {
        alleQuery.push({
          productAllergen: {
            connectOrCreate: {
              where: { name: 'soybeans' },
              create: { name: 'soybeans', label: 'Soybeans' },
            },
          },
        });
      }
      const uuid = uuidv4();
      await this.prisma.customers.upsert({
        where: { email: cu.email },
        create: {
          email: cu.email,
          uuid,
          age,
          gender,
          heightCm: height,
          weightKg: weight,
          activeLevel,
          intermediateCustomerAllergens: { create: alleQuery },
          intermediateCustomerMedicalConditions: { create: mediQuery },
          intermediateCustomerCategoryPreferences: { create: cateQuery },
          intermediateCustomerNutritionNeeds: {
            create: [
              {
                nutritionValue: BMR,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'BMR' },
                    create: { label: 'BMR', name: 'BMR' },
                  },
                },
              },
              {
                nutritionValue: carbsMacronutrients,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'carbsMacronutrients' },
                    create: {
                      label: 'Carbs Macronutrients',
                      name: 'carbsMacronutrients',
                    },
                  },
                },
              },
              {
                nutritionValue: proteinMacronutrients,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'proteinMacronutrients' },
                    create: {
                      label: 'Protein Macronutrients',
                      name: 'proteinMacronutrients',
                    },
                  },
                },
              },
              {
                nutritionValue: fatMacronutrients,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'fatMacronutrients' },
                    create: {
                      label: 'Fat Macronutrients',
                      name: 'fatMacronutrients',
                    },
                  },
                },
              },
              {
                nutritionValue: carbsPerMeal,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'carbsPerMeal' },
                    create: {
                      name: 'carbsPerMeal',
                      label: 'Carbs Per Meal',
                    },
                  },
                },
              },
              {
                nutritionValue: proteinPerMeal,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'proteinPerMeal' },
                    create: {
                      name: 'proteinPerMeal',
                      label: 'Protein Per Meal',
                    },
                  },
                },
              },
              {
                nutritionValue: fatPerMeal,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'fatPerMeal' },
                    create: {
                      name: 'fatPerMeal',
                      label: 'Fat Per Meal',
                    },
                  },
                },
              },
              {
                nutritionValue: caloriePerMeal,
                customerNutritionNeed: {
                  connectOrCreate: {
                    where: { name: 'caloriePerMeal' },
                    create: {
                      name: 'caloriePerMeal',
                      label: 'Calorie Per Meal',
                    },
                  },
                },
              },
            ],
          },
        },
        update: {},
      });
    }

    // const AllDiscoveries = await this.prisma.discoveries.findMany({});
    // for (let i = 0; i < AllDiscoveries.length; i++) {
    //   await this.prisma.$queryRaw`
    // with first_insert as (
    //     insert into public."Customers"(email)
    //     values(${AllDiscoveries[i]['email']})
    //     RETURNING id
    //  )
    //  insert into public."IntermediateCustomerNutritionNeed" ("customerId", "customerNutritionNeedId" ,"nutritionValue")
    //  values
    //  ( (select id from first_insert),(1),  ${AllDiscoveries[i]['BMR']}),
    //  ( (select id from first_insert),(2),  ${AllDiscoveries[i]['carbs_macronutrients']}),
    //  ( (select id from first_insert),(3),  ${AllDiscoveries[i]['protein_macronutrients']}),
    //  ( (select id from first_insert),(4),  ${AllDiscoveries[i]['fat_macronutrients']}),
    //  ( (select id from first_insert),(5),  ${AllDiscoveries[i]['carbs_per_meal']}),
    //  ( (select id from first_insert),(6),  ${AllDiscoveries[i]['protein_per_meal']}),
    //  ( (select id from first_insert),(7),  ${AllDiscoveries[i]['fat_per_meal']}),
    //  ( (select id from first_insert),(8),  ${AllDiscoveries[i]['calorie_per_meal']});
    // `;
    // }
  }
}
