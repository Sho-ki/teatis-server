import { Injectable } from '@nestjs/common';
import { DisplayProduct, Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Practitioner } from '@Domains/Practitioner';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { SocialMedia } from '@Domains/SocialMedia';

interface getPractitionerAndBoxByUuidArgs {
  practitionerBoxUuid: string;
}

interface getPractitionerAndBoxByLabelArgs {
  practitionerId: number;
  label: string;
}

interface createPractitionerAndBoxArgs {
  practitionerId: number;
  practitionerBoxUuid: string;
  label: string;
  products: { id: number }[];
  description?: string;
  note?: string;
}

export interface PractitionerBoxRepositoryInterface {
  getPractitionerAndBoxByUuid({
    practitionerBoxUuid,
  }: getPractitionerAndBoxByUuidArgs): Promise<[PractitionerAndBox?, Error?]>;

  getPractitionerAndBoxByLabel({
    practitionerId,
    label,
  }: getPractitionerAndBoxByLabelArgs): Promise<[PractitionerAndBox?, Error?]>;

  createPractitionerAndBox({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    description,
    note,
  }: createPractitionerAndBoxArgs): Promise<[PractitionerAndBox?, Error?]>;
}

@Injectable()
export class PractitionerBoxRepository
  implements PractitionerBoxRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async createPractitionerAndBox({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    description,
    note,
  }: createPractitionerAndBoxArgs): Promise<[PractitionerAndBox?, Error?]> {
    try {
      if (!products.length) {
        throw new Error();
      }

      const existingProducts =
        await this.prisma.intermediatePractitionerBoxProduct.findMany({
          where: { practitionerBox: { AND: [{ label, practitionerId }] } },
          select: {
            product: true,
          },
        });
      const existingProductIds = existingProducts.map(
        ({ product }) => product.id,
      );
      const existingProductIdSet = new Set(existingProductIds);
      const newProductIds = products.map((product) => product.id);
      const newProductIdSet = new Set(newProductIds);

      const productIdsToRemove = existingProductIds.filter(
        (id) => !newProductIdSet.has(id),
      );
      // Delete

      const productIdsToAdd = newProductIds.filter(
        (id) => !existingProductIdSet.has(id),
      );
      // Add

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
          intermediatePractitionerBoxProduct: {
            select: {
              product: true,
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: createPractitionerAndBox failed',
        },
      ];
    }
  }
  async getPractitionerAndBoxByLabel({
    practitionerId,
    label,
  }: getPractitionerAndBoxByLabelArgs): Promise<[PractitionerAndBox?, Error?]> {
    try {
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
                  productImages: {
                    select: { id: true, src: true, position: true },
                  },
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
      if (!response) {
        throw new Error();
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getPractitionerAndBoxByLabel failed',
        },
      ];
    }
  }

  async getPractitionerAndBoxByUuid({
    practitionerBoxUuid,
  }: getPractitionerAndBoxByUuidArgs): Promise<[PractitionerAndBox?, Error?]> {
    try {
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
                  productImages: {
                    select: { id: true, src: true, position: true },
                  },
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
      if (!response) {
        throw new Error();
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getPractitionerAndBoxByUuid failed',
        },
      ];
    }
  }
}
