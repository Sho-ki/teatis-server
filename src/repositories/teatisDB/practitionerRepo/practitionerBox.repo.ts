import { Injectable } from '@nestjs/common';
import { DisplayProduct, Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { PractitionerBoxProduct } from '../../../domains/PractitionerBoxProduct';
import { Practitioner } from '../../../domains/Practitioner';
import { PractitionerBox } from '../../../domains/PractitionerBox';
import { PractitionerSocialMediaBoxDisplayProduct } from '../../../domains/PractitionerSocialMediaBoxDisplayProduct';
import { SocialMedia } from '../../../domains/SocialMedia';

interface getPractitionerBoxProductArgs {
  practitionerBoxUuid: string;
}

interface createPractitionerBoxProductArgs {
  practitionerId: number;
  practitionerBoxUuid: string;
  label: string;
  products: { id: number }[];
  note?: string;
}

export interface PractitionerBoxRepoInterface {
  getPractitionerBoxProduct({
    practitionerBoxUuid,
  }: getPractitionerBoxProductArgs): Promise<
    [PractitionerSocialMediaBoxDisplayProduct?, Error?]
  >;

  createPractitionerBoxProduct({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    note,
  }: createPractitionerBoxProductArgs): Promise<
    [PractitionerBoxProduct?, Error?]
  >;
}

@Injectable()
export class PractitionerBoxRepo implements PractitionerBoxRepoInterface {
  constructor(private prisma: PrismaService) {}
  async createPractitionerBoxProduct({
    practitionerId,
    practitionerBoxUuid,
    label,
    products,
    note,
  }: createPractitionerBoxProductArgs): Promise<
    [PractitionerBoxProduct?, Error?]
  > {
    try {
      if (!products.length) {
        throw new Error();
      }

      const existingProducts =
        await this.prisma.intermediatePractitionerBoxProduct.findMany({
          where: { practitionerBox: { AND: [{ practitionerId, label }] } },
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
        },
      });

      const response = await this.prisma.practitionerBox.upsert({
        where: { PractitionerBoxIdentifier: { practitionerId, label } },
        create: {
          label,
          uuid: practitionerBoxUuid,
          practitionerId,
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
          label: true,
          note: true,
          practitioner: {
            select: {
              id: true,
              email: true,
              uuid: true,
              profileImage: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
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
        label: response.label,
        note: response?.note,
      };
      return [
        {
          ...practitioner,
          ...practitionerBox,
          product: boxProducts,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: createPractitionerBoxProduct failed',
        },
      ];
    }
  }
  async getPractitionerBoxProduct({
    practitionerBoxUuid,
  }: getPractitionerBoxProductArgs): Promise<
    [PractitionerSocialMediaBoxDisplayProduct?, Error?]
  > {
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
          label: true,
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

      const boxLabel: PractitionerBox = {
        label: response.label,
        note: response.note,
      };
      return [
        {
          ...practitioner,
          ...socialMedia,
          ...boxLabel,
          product: boxProducts,
        },
      ];
    } catch (e) {
      console.log(e);
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getPractitionerBoxProduct failed',
        },
      ];
    }
  }
}
