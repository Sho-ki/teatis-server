import { Injectable } from '@nestjs/common';
import { DisplayProduct, Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Practitioner } from '@Domains/Practitioner';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { SocialMedia } from '@Domains/SocialMedia';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { ReturnValueType } from '@Filters/customError';
import { nextMonth } from '@Usecases/utils/dates';

interface getPractitionerAndBoxByUuidArgs {
  practitionerBoxUuid: string;
}

interface getPractitionerAndBoxByLabelArgs {
  practitionerId: number;
  label: string;
}

interface upsertPractitionerAndPractitionerBoxArgs {
  practitionerId: number;
  practitionerBoxUuid: string;
  label: string;
  products: { id: number }[];
  description?: string;
  note?: string;
}

interface getPractitionerRecurringBoxArgs {
  practitionerId: number;
  label: string;
}

export interface PractitionerBoxRepositoryInterface {
  getPractitionerAndBoxByUuid({ practitionerBoxUuid }: getPractitionerAndBoxByUuidArgs):
  Promise<ReturnValueType<PractitionerAndBox>>;

  getPractitionerRecurringBox({ practitionerId, label }:getPractitionerRecurringBoxArgs):
  Promise<ReturnValueType<PractitionerBox>>;

  getPractitionerAndBoxByLabel({
    practitionerId,
    label,
  }: getPractitionerAndBoxByLabelArgs): Promise<ReturnValueType<PractitionerAndBox>>;

  upsertPractitionerAndPractitionerBox({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    description,
    note,
  }: upsertPractitionerAndPractitionerBoxArgs): Promise<ReturnValueType<PractitionerAndBox>>;
  getAllRecurringBox(): Promise<ReturnValueType<PractitionerBox[]>>;
  getAllPractitionerBoxes(): Promise<ReturnValueType<PractitionerBox[]>>;
}

@Injectable()
export class PractitionerBoxRepository
implements PractitionerBoxRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getPractitionerRecurringBox({ practitionerId, label }:getPractitionerRecurringBoxArgs):
  Promise<ReturnValueType<PractitionerBox>>{
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const response = await this.prisma.practitionerBox.findUnique(
      {
        where: { PractitionerBoxIdentifier: { practitionerId, label: `${year}-${month}___${label}}` } },
        select: {
          id: true,
          uuid: true,
          label: true,
          description: true,
          note: true,
          intermediatePractitionerBoxProduct: {
            select: {
              product: {
                select: {
                  id: true,
                  externalSku: true,
                  name: true,
                  label: true,
                },
              },
            },
          },
        },
      });

    const practitionerBox:PractitionerBox = {
      id: response.id,
      uuid: response.uuid,
      label: response.label,
      description: response.description,
      note: response.note,
      products: response.intermediatePractitionerBoxProduct.map(({ product }) => {
        return { id: product.id, label: product.label, sku: product.externalSku, name: product.name };
      }),
    };
    return [practitionerBox, undefined];
  }

  async upsertPractitionerAndPractitionerBox({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    description,
    note,
  }: upsertPractitionerAndPractitionerBoxArgs): Promise<ReturnValueType<PractitionerAndBox>> {
    const existingProducts =
      await this.prisma.intermediatePractitionerBoxProduct.findMany({
        where: { practitionerBox: { AND: [{ label, practitionerId }] } },
        select: { product: true },
      });

    const existingProductIds = existingProducts.map(
      ({ product }) => product.id,
    );
    const newProductIds = products.map((product) => product.id);

    const [productIdsToAdd, productIdsToRemove] = calculateAddedAndDeletedIds(existingProductIds, newProductIds );

    await this.prisma.intermediatePractitionerBoxProduct.deleteMany({
      where: {
        OR: productIdsToRemove.map((productId) => {
          return { productId };
        }),
        practitionerBox: { AND: [{ label, practitionerId }] },
      },
    });
    const response = await this.prisma.practitionerBox.upsert({
      where: { PractitionerBoxIdentifier: { practitionerId, label } },
      create: {
        label,
        uuid: practitionerBoxUuid,
        practitionerId,
        description,
        note,
        intermediatePractitionerBoxProduct: {
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
        intermediatePractitionerBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      select: {
        intermediatePractitionerBoxProduct: { select: { product: true } },
        id: true,
        uuid: true,
        label: true,
        description: true,
        note: true,
        practitioner: {
          select: {
            practitionerSocialMedia: {
              select: {
                instagram: true,
                facebook: true,
                twitter: true,
                website: true,
              },
            },
            id: true,
            email: true,
            uuid: true,
            profileImage: true,
            firstName: true,
            lastName: true,
            middleName: true,
            message: true,
          },
        },
      },
    });
    const socialMedia: SocialMedia =
      response.practitioner.practitionerSocialMedia;
    delete response.practitioner.practitionerSocialMedia;
    const practitioner: Practitioner = response.practitioner;
    const boxProducts: Product[] =
      response.intermediatePractitionerBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
        };
      });
    const practitionerBox: PractitionerBox = {
      id: response.id,
      uuid: response.uuid,
      label: response.label,
      description: response?.description,
      note: response?.note,
      products: boxProducts,
    };
    return [
      {
        ...practitioner,
        ...socialMedia,
        box: { ...practitionerBox },
      },
    ];
  }
  async getPractitionerAndBoxByLabel({
    practitionerId,
    label,
  }: getPractitionerAndBoxByLabelArgs): Promise<ReturnValueType<PractitionerAndBox>> {
    const response = await this.prisma.practitionerBox.findUnique({
      where: { PractitionerBoxIdentifier: { label, practitionerId } },
      select: {
        intermediatePractitionerBoxProduct: {
          select: {
            product: {
              select: {
                id: true,
                productVendor: { select: { label: true } },
                externalSku: true,
                productImages: { select: { id: true, src: true, position: true } },
                expertComment: true,
                label: true,
                name: true,
                productNutritionFact: true,
                ingredientLabel: true,
                allergenLabel: true,
              },
            },
          },
        },
        id: true,
        uuid: true,
        label: true,
        description: true,
        note: true,
        practitioner: {
          select: {
            practitionerSocialMedia: {
              select: {
                instagram: true,
                facebook: true,
                twitter: true,
                website: true,
              },
            },
            id: true,
            email: true,
            uuid: true,
            profileImage: true,
            firstName: true,
            lastName: true,
            middleName: true,
            message: true,
          },
        },
      },
    });

    if (
      !response?.practitioner ||
      !response?.intermediatePractitionerBoxProduct
    ) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'practitionerId/label is invalid',
        },
      ];
    }
    const socialMedia: SocialMedia =
      response.practitioner.practitionerSocialMedia;
    delete response.practitioner.practitionerSocialMedia;
    const practitioner: Practitioner = response.practitioner;
    const boxProducts: DisplayProduct[] = response
      .intermediatePractitionerBoxProduct.length
      ? response.intermediatePractitionerBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
          expertComment: product.expertComment,
          ingredientLabel: product.ingredientLabel,
          images: product.productImages,
          allergenLabel: product.allergenLabel,
          vendor: product.productVendor.label,
          nutritionFact: {
            calorie: product.productNutritionFact.calories,
            totalFat: product.productNutritionFact.totalFatG,
            saturatedFat: product.productNutritionFact.saturatedFatG,
            transFat: product.productNutritionFact.transFatG,
            cholesterole: product.productNutritionFact.cholesteroleMg,
            sodium: product.productNutritionFact.sodiumMg,
            totalCarbohydrate:
                product.productNutritionFact.totalCarbohydrateG,
            dietaryFiber: product.productNutritionFact.dietaryFiberG,
            totalSugar: product.productNutritionFact.totalSugarG,
            addedSugar: product.productNutritionFact.addedSugarG,
            protein: product.productNutritionFact.proteinG,
          },
        };
      })
      : [];

    const practitionerBox: PractitionerBox = {
      id: response.id,
      uuid: response.uuid,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [
      {
        ...practitioner,
        ...socialMedia,
        box: { ...practitionerBox },
      },
    ];
  }

  async getPractitionerAndBoxByUuid({ practitionerBoxUuid }: getPractitionerAndBoxByUuidArgs):
  Promise<ReturnValueType<PractitionerAndBox>> {
    const response = await this.prisma.practitionerBox.findUnique({
      where: { uuid: practitionerBoxUuid },
      select: {
        intermediatePractitionerBoxProduct: {
          select: {
            product: {
              select: {
                id: true,
                productVendor: { select: { label: true } },
                externalSku: true,
                productImages: { select: { id: true, src: true, position: true } },
                expertComment: true,
                label: true,
                name: true,
                productNutritionFact: true,
                ingredientLabel: true,
                allergenLabel: true,
              },
            },
          },
        },
        id: true,
        uuid: true,
        label: true,
        description: true,
        note: true,
        practitioner: {
          select: {
            practitionerSocialMedia: {
              select: {
                instagram: true,
                facebook: true,
                twitter: true,
                website: true,
              },
            },
            id: true,
            email: true,
            uuid: true,
            profileImage: true,
            firstName: true,
            lastName: true,
            middleName: true,
            message: true,
          },
        },
      },
    });

    if (
      !response?.practitioner ||
      !response?.intermediatePractitionerBoxProduct
    ) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'practitionerBoxUuid is invalid',
        },
      ];
    }

    const socialMedia: SocialMedia =
      response.practitioner.practitionerSocialMedia;
    delete response.practitioner.practitionerSocialMedia;
    const practitioner: Practitioner = response.practitioner;
    const boxProducts: DisplayProduct[] = response
      .intermediatePractitionerBoxProduct.length
      ? response.intermediatePractitionerBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
          expertComment: product.expertComment,
          ingredientLabel: product.ingredientLabel,
          images: product.productImages,
          allergenLabel: product.allergenLabel,
          vendor: product.productVendor.label,
          nutritionFact: {
            calorie: product.productNutritionFact.calories,
            totalFat: product.productNutritionFact.totalFatG,
            saturatedFat: product.productNutritionFact.saturatedFatG,
            transFat: product.productNutritionFact.transFatG,
            cholesterole: product.productNutritionFact.cholesteroleMg,
            sodium: product.productNutritionFact.sodiumMg,
            totalCarbohydrate:
                product.productNutritionFact.totalCarbohydrateG,
            dietaryFiber: product.productNutritionFact.dietaryFiberG,
            totalSugar: product.productNutritionFact.totalSugarG,
            addedSugar: product.productNutritionFact.addedSugarG,
            protein: product.productNutritionFact.proteinG,
          },
        };
      })
      : [];

    const practitionerBox: PractitionerBox = {
      id: response.id,
      uuid: response.uuid,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [
      {
        ...practitioner,
        ...socialMedia,
        box: { ...practitionerBox },
      },
    ];
  }
  async getAllRecurringBox(): Promise<ReturnValueType<PractitionerBox[]>>{
    const recurringBoxLabel = 'Recurring___'+nextMonth()+'___';
    const responseArray = await this.prisma.practitionerBox.findMany(
      {
        where: { label: { contains: recurringBoxLabel } },
        select: {
          id: true,
          uuid: true,
          label: true,
          description: true,
          note: true,
          intermediatePractitionerBoxProduct: {
            select: {
              product: {
                select: {
                  id: true,
                  externalSku: true,
                  name: true,
                  label: true,
                },
              },
            },
          },
        },
      });
    const practitionerBoxes: PractitionerBox[] = responseArray.map(response => {
      return {
        id: response.id,
        uuid: response.uuid,
        label: response.label,
        description: response.description,
        note: response.note,
        products: response.intermediatePractitionerBoxProduct.map(({ product }) => {
          return { id: product.id, label: product.label, sku: product.externalSku, name: product.name };
        }),
      };
    });
    return [practitionerBoxes, undefined];
  }
  async getAllPractitionerBoxes(): Promise<ReturnValueType<PractitionerBox[]>>{
    const responseArray = await this.prisma.practitionerBox.findMany(
      {
        orderBy: [{ createdAt: 'desc' }],
        select: {
          id: true,
          practitionerId: true,
          uuid: true,
          label: true,
          description: true,
          note: true,
          intermediatePractitionerBoxProduct: {
            select: {
              product: {
                select: {
                  id: true,
                  externalSku: true,
                  name: true,
                  label: true,
                },
              },
            },
          },
        },
      });
    const practitionerBoxes: PractitionerBox[] = responseArray.map(response => {
      return {
        id: response.id,
        practitionerId: response.practitionerId,
        uuid: response.uuid,
        label: response.label,
        description: response.description,
        note: response.note,
        products: response.intermediatePractitionerBoxProduct.map(({ product }) => {
          return { id: product.id, label: product.label, sku: product.externalSku, name: product.name };
        }),
      };
    });
    return [practitionerBoxes, undefined];
  }
}
