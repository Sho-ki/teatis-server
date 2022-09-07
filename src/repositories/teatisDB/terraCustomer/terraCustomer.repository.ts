import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CustomerAndTerraCustomer } from '../../../domains/CustomerAndTerraCustomer';
import { GlucoseLog } from '../../../domains/GlucoseLog';
import { Status } from '../../../domains/Status';

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
        timestamp: string;
        timestampUtc:Date;
    }[];
}

export interface TerraCustomerRepositoryInterface {
//   getTerraCustomers({ terraCustomerIds }: GetTerraCustomersArgs): Promise<ReturnValueType<Product[]>>;
  upsertTerraCustomer({ customerId, terraCustomerId }: UpsertTerraCustomersArgs):
   Promise<ReturnValueType<CustomerAndTerraCustomer>>;
  getCustomerGlucoseLogs({ terraCustomerId }:GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>;
  addCustomerGlucoseLogs({ terraCustomerKeyId,  data }:AddCustomerGlucoseLogsArgs):
   Promise<ReturnValueType<Status>>;
}

@Injectable()
export class TerraCustomerRepository implements TerraCustomerRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  //   async getTerraCustomers({ terraCustomerIds }: GetTerraCustomersArgs): Promise<ReturnValueType<Product[]>> {
  //     const response = await this.prisma.terraCustomer.findMany(
  //       {
  //         where:
  //             { OR: terraCustomerIds.map((id) => { return { terraCustomerId: id }; }) },
  //         select: { customer: { select: { id: true, email: true, uuid: true } }, id: true, terraCustomerId: true },
  //       });
  //     return;
  //     // return [productsRes];
  //   }

  async upsertTerraCustomer({ customerId, terraCustomerId }: UpsertTerraCustomersArgs):
   Promise<ReturnValueType<CustomerAndTerraCustomer>>{
    const response = await this.prisma.terraCustomer.upsert({
      where: { customerId },
      create: {
        customerId,
        terraCustomerId,
      },
      update: { terraCustomerId },
      select: {
        customer: true,
        terraCustomerId: true,
      },
    });

    const { email, id, uuid } = response.customer;
    if(!email ||  !id || !uuid || !response.terraCustomerId){
      return [undefined, { name: 'Error', message: 'customerId is invalid' }];
    }
    return [{ email, id, uuid, terraCustomerId: response.terraCustomerId  }];
  }

  async getCustomerGlucoseLogs({ terraCustomerId }:GetCustomerGlucoseLogsArgs):Promise<ReturnValueType<GlucoseLog>>{
    const response = await this.prisma.terraCustomer.findUnique({
      where: { terraCustomerId },
      select: { terraCustomerLog: true, id: true },
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

  async addCustomerGlucoseLogs({ terraCustomerKeyId, data }:AddCustomerGlucoseLogsArgs):
   Promise<ReturnValueType<Status>>{
    await this.prisma.terraCustomerLog.createMany(
      {
        data: data.map(({ glucoseValue, timestamp, timestampUtc }) => {
          return { terraCustomerKeyId, timestamp, glucoseValue, timestampUtc };
        }),
        skipDuplicates: true,
      } );

    return [{ success: true }];
  }
}
