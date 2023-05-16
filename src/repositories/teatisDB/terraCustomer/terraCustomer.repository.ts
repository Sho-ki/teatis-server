import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CustomerAndTerraCustomer } from '../../../domains/CustomerAndTerraCustomer';
import { GlucoseLog } from '../../../domains/GlucoseLog';
import {  Prisma } from '@prisma/client';
import { TerraCustomerWithLogs } from '../../../domains/TerraCustomerWithLogs';

export interface GetTerraCustomersArgs {
  terraCustomerIds: string[];
}

export interface UpsertTerraCustomersArgs {
  customerId: number;
  terraCustomerId:string;
}

export interface GetCustomerGlucoseLogsArgs {
  terraCustomerId:string;
}

export interface AddCustomerGlucoseLogsArgs {
    terraCustomerKeyId:number | null;
    data: {
        glucoseValue: number;
        timestamp: Date;
        timestampUtc:Date;
    }[];
}

export interface GetCustomerGlucoseLogsByCustomerIdArgs {
  customerId:number;
}

export interface TerraCustomerRepositoryInterface {
  // getActiveTerraCustomers(): Promise<ReturnValueType<TerraCustomer[]>>;
  upsertTerraCustomer({ customerId, terraCustomerId }: UpsertTerraCustomersArgs):
   Promise<ReturnValueType<CustomerAndTerraCustomer>>;
  getCustomerGlucoseLogs({ terraCustomerId }:GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>;
  addCustomerGlucoseLogs({ terraCustomerKeyId,  data }:AddCustomerGlucoseLogsArgs):
   Promise<ReturnValueType<Prisma.BatchPayload>>;

  getCustomerGlucoseLogsByCustomerId({ customerId }:GetCustomerGlucoseLogsByCustomerIdArgs)
  :Promise<ReturnValueType<TerraCustomerWithLogs>>;
}

@Injectable()
export class TerraCustomerRepository implements TerraCustomerRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  // async getActiveTerraCustomers(): Promise<ReturnValueType<TerraCustomer[]>> {
  //   const response = await this.prisma.terraCustomer.findMany(
  //     { where: { activeStatus: ActiveStatus.active } });
  //   return [response];
  // }

  async upsertTerraCustomer({ customerId, terraCustomerId }: UpsertTerraCustomersArgs):
   Promise<ReturnValueType<CustomerAndTerraCustomer>>{
    const response = await this.prisma.terraCustomer.upsert({
      where: { customerId },
      create: {
        customerId,
        terraCustomerId,
      },
      update: { terraCustomerId },
      include: { customer: true },
    });

    const { email, id, uuid } = response.customer;
    if(!email ||  !id || !uuid || !response.terraCustomerId){
      return [undefined, { name: 'Error', message: 'customerId is invalid' }];
    }
    return [
      {
        email, id, uuid, terraCustomerId: response.terraCustomerId,
        totalPoints: response.customer.totalPoints,
        customerType: response.customer.customerType,
      },
    ];
  }

  async getCustomerGlucoseLogs({ terraCustomerId }:GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>{
    const response = await this.prisma.terraCustomer.findUnique({
      where: { terraCustomerId },
      include: { terraCustomerLog: true },
    });
    const glucoseLogs:GlucoseLog ={
      terraCustomerId,
      terraCustomerKeyId: response?.id || null,
      data: response?.terraCustomerLog?.map(({ timestamp, glucoseValue, timestampUtc }) =>
      { return { timestamp, timestampUtc, glucoseValue }; }
      ) || [],
    };
    return [glucoseLogs];
  }

  async getCustomerGlucoseLogsByCustomerId({ customerId }:GetCustomerGlucoseLogsByCustomerIdArgs):
  Promise<ReturnValueType<TerraCustomerWithLogs>>{
    const response = await this.prisma.terraCustomer.findUnique({
      where: { customerId },
      include: { terraCustomerLog: true },
    });
    if(!response){
      return [undefined, { name: 'NotFound', message: 'This customer has not connected to this device' }];
    }

    return [response];
  }

  async addCustomerGlucoseLogs({ terraCustomerKeyId, data }:AddCustomerGlucoseLogsArgs):
   Promise<ReturnValueType<Prisma.BatchPayload>>{
    const response = await this.prisma.terraCustomerLog.createMany(
      {
        data: data.map(({ glucoseValue, timestamp, timestampUtc }) => {
          return { terraCustomerKeyId, timestamp, glucoseValue, timestampUtc };
        }),
        skipDuplicates: true,
      } );

    return [response];
  }
}
