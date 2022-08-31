import { Inject, Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { ReturnValueType } from '@Filters/customError';
import { MasterMonthlyBox } from '@Domains/MasterMonthlyBox';
import { Transactionable } from '../../utils/transactionable.interface';
import { Prisma, PrismaClient } from '@prisma/client';

interface getMasterMonthlyBoxByLabelArgs {
  label: string;
}

interface createMasterMonthlyBoxArgs {
  label: string;
  products: { id: number }[];
  description?: string;
  note?: string;
}

export interface MasterMonthlyBoxRepositoryInterface extends Transactionable{
  getMasterMonthlyBoxByLabel({ label }: getMasterMonthlyBoxByLabelArgs): Promise<ReturnValueType<MasterMonthlyBox>>;

  createMasterMonthlyBox({
    label,
    products,
    description,
    note,
  }: createMasterMonthlyBoxArgs): Promise<ReturnValueType<MasterMonthlyBox>>;
}

@Injectable()
export class MasterMonthlyBoxRepository
implements MasterMonthlyBoxRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): MasterMonthlyBoxRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createMasterMonthlyBox({
    label,
    products,
    description,
    note,
  }: createMasterMonthlyBoxArgs): Promise<ReturnValueType<MasterMonthlyBox>> {
    const existingProducts =
      await this.prisma.intermediateMasterMonthlyBoxProduct.findMany({
        where: { masterMonthlyBox: { label } },
        select: { product: true },
      });
    const existingProductIds = existingProducts.length ? existingProducts.map(
      ({ product }) => product.id,
    ): [];
    const newProductIds = products.map((product) => product.id);
    const [productIdsToAdd, productIdsToRemove] = calculateAddedAndDeletedIds(existingProductIds, newProductIds );
    if(productIdsToRemove.length){
      await this.prisma.intermediateMasterMonthlyBoxProduct.deleteMany({
        where: {
          OR: productIdsToRemove.map((productId) => {
            return { productId };
          }),
          masterMonthlyBox: { label },
        },
      });
    }
    const response = await this.prisma.masterMonthlyBox.upsert({
      where: { label },
      create: {
        label,
        description,
        note,
        intermediateMasterMonthlyBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      update: {
        description,
        note,
        intermediateMasterMonthlyBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      select: {
        intermediateMasterMonthlyBoxProduct: { select: { product: true } },
        id: true,
        label: true,
        description: true,
        note: true,
      },
    });
    const boxProducts: Product[] =
      response.intermediateMasterMonthlyBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
        };
      });
    const masterMonthlyBox: MasterMonthlyBox = {
      id: response.id,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [{ ...masterMonthlyBox }];
  }
  async getMasterMonthlyBoxByLabel(
    { label }: getMasterMonthlyBoxByLabelArgs): Promise<ReturnValueType<MasterMonthlyBox>> {
    const response = await this.prisma.masterMonthlyBox.findUnique({
      where: { label },
      select: {
        intermediateMasterMonthlyBoxProduct: {
          select: {
            product: {
              select: {
                id: true,
                externalSku: true,
                label: true,
                name: true,
              },
            },
          },
        },
        id: true,
        label: true,
        description: true,
        note: true,
      },
    });

    if (!response?.intermediateMasterMonthlyBoxProduct) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: `label: ${label} is does not exist`,
        },
      ];
    }
    const boxProducts: Product[] = response
      .intermediateMasterMonthlyBoxProduct.length
      ? response.intermediateMasterMonthlyBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
        };
      })
      : [];

    const practitionerBox: MasterMonthlyBox = {
      id: response.id,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [{ ...practitionerBox }, undefined];
  }
}
