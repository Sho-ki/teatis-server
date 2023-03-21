import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '@Domains/Customer';

import { PrismaService } from '../../../prisma.service';
import { CustomerMedicalCondition } from '@Domains/CustomerMedicalCondition';
import { ReturnValueType } from '@Filters/customError';
import { ActiveStatus, Country, GenderIdentify, Prisma, PrismaClient, RewardEventType } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { CustomerWithAddress } from '../../../domains/CustomerWithAddress';

export interface GetCustomerArgs {
  email: string;
}

export interface GetCustomerByPhoneArgs {
  phone: string;
}

interface UpsertCustomerArgs {
  uuid: string;
  gender: GenderIdentify;
  flavorDislikeIds: number[];
  ingredientDislikeIds: number[];
  allergenIds: number[];
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  coachingSubscribed?: ActiveStatus;
  boxSubscribed?: ActiveStatus;
}

interface UpsertCustomerAddressArgs {
  customerId: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: Country;
}

interface GetCustomerPreferenceArgs {
  type:
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'ingredients'
    | 'categoryPreferences';
  email: string;
}

interface GetCustomerByUuidArgs {
  uuid: string;
}

interface GetCustomerByTwilioChannelSidArgs {
  twilioChannelSid: string;
}

interface GetCustomersWithAddressArgs {
  customerIds: number[];
}

interface GetCustomerMedicalConditionArgs {
  email: string;
}

interface UpdateCustomerByUuidArgs {
  uuid: string;
  newEmail?: string;
  phone?:string;
  firstName?:string;
  lastName?:string;
}

interface UpdateCustomerTwilioChannelSidArgs {
  customerId: number;
  twilioChannelSid:string;
}

type UnsubscribeEventType = 'boxUnsubscribed'|'coachingUnsubscribed';

export interface deactivateCustomerSubscriptionArgs {
  uuid: string;
  type: UnsubscribeEventType[];
  eventDate?:Date;
}

export interface FindCustomersWithPointsOverThresholdArgs {
  pointsThreshold: number;
}

export interface FindCustomersWithPointsOverThresholdArgs {
  pointsThreshold: number;
}

export interface UpdateTotalPointsArgs {
  customerId: number;
  points: number;
  type: RewardEventType;
}

type SubscribeEventType = 'boxSubscribed'|'coachingSubscribed';

export interface activateCustomerSubscriptionArgs {
  uuid: string;
  type: SubscribeEventType[];
  eventDate?:Date;
}

export interface CustomerGeneralRepositoryInterface extends Transactionable {
  getCustomer({ email }: GetCustomerArgs): Promise<ReturnValueType<Customer>>;
  getCustomerByPhone({ phone }: GetCustomerByPhoneArgs): Promise<ReturnValueType<Customer>>;
  getCustomerPreference({ email }: GetCustomerPreferenceArgs): Promise<ReturnValueType<{id:number[]}>>;
  getCustomerMedicalCondition({ email }: GetCustomerMedicalConditionArgs): Promise<
    [CustomerMedicalCondition?, Error?]
  >;
  getCustomerByUuid({ uuid }: GetCustomerByUuidArgs): Promise<ReturnValueType<Customer>>;
  getCustomerByTwilioChannelSid({ twilioChannelSid }: GetCustomerByTwilioChannelSidArgs):
  Promise<ReturnValueType<Customer>>;
  getCustomersWithAddress({ customerIds }: GetCustomersWithAddressArgs):
  Promise<ReturnValueType<CustomerWithAddress[]>>;

  updateCustomerByUuid({
    uuid,
    newEmail,
    phone, firstName, lastName,
  }: UpdateCustomerByUuidArgs): Promise<ReturnValueType<Customer>>;

  updateCustomerTwilioChannelSid({ customerId, twilioChannelSid }:UpdateCustomerTwilioChannelSidArgs):
   Promise<Customer>;
  deactivateCustomerSubscription({ uuid, eventDate, type }:
     deactivateCustomerSubscriptionArgs): Promise<Customer>;

  activateCustomerSubscription({ uuid, eventDate, type }:
     activateCustomerSubscriptionArgs): Promise<Customer>;

  upsertCustomer({
    uuid,
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
    phone,
    firstName,
    lastName,
    coachingSubscribed,
    boxSubscribed,
  }: UpsertCustomerArgs): Promise<ReturnValueType<Customer>>;

  upsertCustomerAddress({
    customerId,
    address1,
    address2,
    city,
    state,
    zip,
    country,
  }: UpsertCustomerAddressArgs ): Promise<ReturnValueType<CustomerWithAddress>>;
  findCustomersWithPointsOverThreshold({ pointsThreshold }: FindCustomersWithPointsOverThresholdArgs):
  Promise<ReturnValueType<Customer[]>>;
  updateTotalPoints({ customerId, points, type }:UpdateTotalPointsArgs): Promise<ReturnValueType<Customer>>;
}

@Injectable()
export class CustomerGeneralRepository
implements CustomerGeneralRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerGeneralRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getCustomersWithAddress({ customerIds }: GetCustomersWithAddressArgs):
  Promise<ReturnValueType<CustomerWithAddress[]>>{
    const response = await this.prisma.customers.findMany(
      { where: { id: { in: customerIds } }, include: { customerAddress: true } });
    return [response];
  }

  async deactivateCustomerSubscription({ uuid, eventDate = new Date(), type }:
     deactivateCustomerSubscriptionArgs): Promise<Customer> {
    let data:Prisma.CustomersUpdateInput;
    const eventLogData:Prisma.CustomerEventLogCreateManyCustomerInput[] = [];

    for(const t of type){
      if(t === 'boxUnsubscribed'){
        data = {
          ...data,
          boxSubscribed: 'inactive',
        };
      }
      if(t === 'coachingUnsubscribed'){
        data = { ...data, coachingSubscribed: 'inactive' };
      }
      eventLogData.push({ eventDate, type: t });
    }

    data = { ...data, customerEventLog: { createMany: { data: eventLogData } } };

    return await this.prisma.customers.update(
      { where: { uuid }, data },
    );
  }

  async activateCustomerSubscription({ uuid, eventDate = new Date(), type }:
     activateCustomerSubscriptionArgs): Promise<Customer> {
    let data:Prisma.CustomersUpdateInput;
    const eventLogData:Prisma.CustomerEventLogCreateManyCustomerInput[] = [];

    for(const t of type){
      if(t === 'boxSubscribed'){
        data = {
          ...data,
          boxSubscribed: 'active',
        };
      }
      if(t === 'coachingSubscribed'){
        data = { ...data, coachingSubscribed: 'active' };
      }
      eventLogData.push({ eventDate, type: t });
    }
    data = { ...data, customerEventLog: { createMany: { data: eventLogData } } };

    return await this.prisma.customers.update(
      { where: { uuid }, data },
    );
  }

  async updateCustomerTwilioChannelSid({ customerId, twilioChannelSid }: UpdateCustomerTwilioChannelSidArgs):
  Promise<Customer> {
    return await this.prisma.customers.update({ where: { id: customerId }, data: { twilioChannelSid } });

  }

  async updateCustomerByUuid({
    uuid,
    newEmail, phone, firstName, lastName,
  }: UpdateCustomerByUuidArgs): Promise<ReturnValueType<Customer>> {
    const existingCustomer = await this.prisma.customers.findUnique({ where: { phone } });

    if(existingCustomer && existingCustomer.uuid !== uuid){
      return [undefined,  { name: 'Phone constraint', message: 'The phone number is already used' }];
    }

    const data:Prisma.CustomersUpdateInput = {};
    if(newEmail) data.email = newEmail;
    if(phone) data.phone = phone;
    if(firstName) data.firstName = firstName;
    if(lastName) data.lastName = lastName;

    const response = await this.prisma.customers.update({
      where: { uuid },
      data,
    });
    if(!response){
      return [undefined, { name: 'Error', message: 'uuid is invalid' }];
    }
    return [
      {
        id: response.id, email: newEmail, uuid,
        phone: response.phone, firstName: response.firstName, lastName: response.lastName,
        createdAt: response.createdAt, updatedAt: response.updatedAt,
      },
    ];

  }

  async getCustomerByUuid({ uuid }: GetCustomerByUuidArgs): Promise<ReturnValueType<Customer>> {
    const response = await this.prisma.customers.findUnique({ where: { uuid } });
    if (!response?.email || !response?.id || !response.uuid) {
      return [undefined, { name: 'NoCustomerUuid', message: 'uuid is invalid' }];
    }
    return [response];
  }
  async getCustomerMedicalCondition({ email }: GetCustomerMedicalConditionArgs): Promise<
    [CustomerMedicalCondition?, Error?]
  > {
    const res = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        id: true,
        uuid: true,
        intermediateCustomerMedicalConditions: { select: { customerMedicalCondition: { select: { name: true } } } },
      },
    });
    const { id, uuid } = res;
    if (!id || !uuid) {
      return [undefined, { name: 'Internal Server Error', message: 'email is invalid' }];
    }
    const customerConditions = res?.intermediateCustomerMedicalConditions;

    const allConditions = customerConditions.length
      ? customerConditions.map((condition) => {
        return condition.customerMedicalCondition.name;
      })
      : [];

    return [
      {
        highBloodPressure: allConditions.includes('highBloodPressure'),
        highCholesterol: allConditions.includes('highCholesterol'),
        id,
        email,
        uuid,
      },
    ];
  }

  async getCustomerPreference({
    email,
    type,
  }: GetCustomerPreferenceArgs): Promise<ReturnValueType<{id:number[]}>> {
    let customerPreference: number[] = [];
    switch (type) {
      case 'flavorDislikes':
        await this.prisma.intermediateCustomerFlavorDislike
          .findMany({
            where: { customer: { email } },
            select: { productFlavorId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((flavor) => {
                return flavor.productFlavorId;
              })
              : [];
          });
        break;
      case 'allergens':
        await this.prisma.intermediateCustomerAllergen
          .findMany({
            where: { customer: { email } },
            select: { productAllergenId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((allergen) => {
                return allergen.productAllergenId;
              })
              : [];
          });
        break;
      case 'unavailableCookingMethods':
        await this.prisma.intermediateCustomerUnavailableCookingMethod
          .findMany({
            where: { customer: { email } },
            select: { productCookingMethodId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((cookingMethod) => {
                return cookingMethod.productCookingMethodId;
              })
              : [];
          });
        break;
      case 'categoryPreferences':
        await this.prisma.intermediateCustomerCategoryPreference
          .findMany({
            where: { customer: { email }, productCategory: { activeStatus: 'active' } },
            select: { productCategoryId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((category) => {
                return category.productCategoryId;
              })
              : [];
          });
        break;
      case 'ingredients':
        await this.prisma.intermediateCustomerIngredientDislike
          .findMany({
            where: { customer: { email } },
            select: { productIngredientId: true  },
          })
          .then(async (response) => {
            const parentIngredientIds:{parentIngredientId:number}[] = response.length
              ? response.map(({ productIngredientId }) => { return  { parentIngredientId: productIngredientId }; })
              : [];

            const allIngredientIds = await this.prisma.productIngredient.findMany(
              {
                where: { OR: parentIngredientIds },
                select: { id: true, name: true },
              });
            const allIds = parentIngredientIds.map(({ parentIngredientId }) => parentIngredientId)
              .concat(allIngredientIds.map(({ id }) => id));
            customerPreference =  allIds;
          });
        break;
      default:
        break;
    }

    return [{ id: customerPreference }];
  }

  async getCustomer({ email }: GetCustomerArgs): Promise<ReturnValueType<Customer>> {
    const response = await this.prisma.customers.findUnique({ where: { email } });
    return [response];
  }

  async getCustomerByPhone({ phone }: GetCustomerByPhoneArgs): Promise<ReturnValueType<Customer>> {
    const response = await this.prisma.customers.findUnique({ where: { phone } });
    return [response];
  }

  async upsertCustomer({
    uuid,
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
    phone = undefined,
    firstName = undefined,
    lastName = undefined,
    coachingSubscribed,
    boxSubscribed,
  }: UpsertCustomerArgs): Promise<ReturnValueType<Customer>> {
    const existingCustomer = await this.prisma.customers.findUnique({ where: { email } });

    if (existingCustomer) {
      const [existingIngredients, existingAllergens, existingFlavors]=
      await Promise.all(
        [
          this.prisma.intermediateCustomerIngredientDislike.findMany(
            { where: { customerId: existingCustomer.id } }),
          this.prisma.intermediateCustomerAllergen.findMany(
            { where: { customerId: existingCustomer.id } }),
          this.prisma.intermediateCustomerFlavorDislike.findMany(
            { where: { customerId: existingCustomer.id } }),
        ]);

      const [ingredientsAdd, ingredientsDelete] =
      calculateAddedAndDeletedIds(existingIngredients.map(val => val.productIngredientId), ingredientDislikeIds);
      const [allergensAdd, allergensDelete] =
      calculateAddedAndDeletedIds(existingAllergens.map(val => val.productAllergenId), allergenIds);
      const [flavorsAdd, flavorsDelete] =
      calculateAddedAndDeletedIds(existingFlavors.map(val => val.productFlavorId), flavorDislikeIds);

      await Promise.all(
        [
          this.prisma.intermediateCustomerIngredientDislike.deleteMany(
            { where: { customerId: existingCustomer.id, productIngredientId: { in: ingredientsDelete } } }),
          this.prisma.intermediateCustomerAllergen.deleteMany(
            { where: { customerId: existingCustomer.id, productAllergenId: { in: allergensDelete } } }),
          this.prisma.intermediateCustomerFlavorDislike.deleteMany(
            { where: { customerId: existingCustomer.id, productFlavorId: { in: flavorsDelete } } }),
        ]);

      ingredientDislikeIds = ingredientsAdd;
      allergenIds = allergensAdd;
      flavorDislikeIds = flavorsAdd;
    }

    const customer = await this.prisma.customers.upsert({
      where: { email },
      create: {
        phone,
        firstName,
        lastName,
        uuid,
        email,
        coachingSubscribed,
        boxSubscribed,
        genderIdentify: gender,
        intermediateCustomerIngredientDislikes:
            ingredientDislikeIds.length
              ? {
                createMany: {
                  data:
                ingredientDislikeIds.map((id) => {
                  return { productIngredientId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},

        intermediateCustomerAllergens:
            allergenIds.length
              ? {
                createMany: {
                  data:
                allergenIds.map((id) => {
                  return { productAllergenId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},
        intermediateCustomerFlavorDislikes:
            flavorDislikeIds.length
              ? {
                createMany: {
                  data:
                flavorDislikeIds.map((id) => {
                  return { productFlavorId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},

      },
      update: {
        phone,
        firstName,
        lastName,
        email,
        coachingSubscribed,
        boxSubscribed,
        genderIdentify: gender,
        intermediateCustomerIngredientDislikes:
            ingredientDislikeIds.length
              ? {
                createMany: {
                  data:
                ingredientDislikeIds.map((id) => {
                  return { productIngredientId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},

        intermediateCustomerAllergens:
            allergenIds.length
              ? {
                createMany: {
                  data:
                allergenIds.map((id) => {
                  return { productAllergenId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},
        intermediateCustomerFlavorDislikes:
            flavorDislikeIds.length
              ? {
                createMany: {
                  data:
                flavorDislikeIds.map((id) => {
                  return { productFlavorId: id };
                }),
                  skipDuplicates: true,
                },
              }
              : {},

      },
    });
    return [{ id: customer.id, uuid: customer.uuid, email }];
  }

  async upsertCustomerAddress({
    customerId,
    address1,
    address2,
    city,
    state,
    zip,
    country,
  }: UpsertCustomerAddressArgs ): Promise<ReturnValueType<CustomerWithAddress>>{
    const response = await this.prisma.customers.update({
      where: { id: customerId },
      data: {
        customerAddress: {
          upsert: {
            create: {
              address1,
              address2,
              city,
              state,
              zip,
              country,
            },
            update: {
              address1,
              address2,
              city,
              state,
              zip,
              country,
            },
          },
        },
      },
      include: { customerAddress: true },
    });

    return [response];
  }

  async findCustomersWithPointsOverThreshold({ pointsThreshold }: FindCustomersWithPointsOverThresholdArgs):
  Promise<ReturnValueType<Customer[]>> {
    const customers = await this.prisma.customers.findMany({ where: { totalPoints: { gte: pointsThreshold } } });
    return [customers];
  }

  async updateTotalPoints({ customerId, points, type }:UpdateTotalPointsArgs): Promise<ReturnValueType<Customer>> {
    const response = await this.prisma.customers.update({
      where: { id: customerId },
      data: { totalPoints: { increment: points }, customerPointLog: { create: { points, type } } },
    });
    return [response];
  }

  async getCustomerByTwilioChannelSid({ twilioChannelSid }: GetCustomerByTwilioChannelSidArgs):
  Promise<ReturnValueType<Customer>>{
    const response = await this.prisma.customers.findUnique({ where: { twilioChannelSid } });
    return [response];
  }

}
