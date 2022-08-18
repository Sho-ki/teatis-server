import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { ReturnValueType } from '@Filters/customError';
import { TeatisBox } from '@Domains/TeatisBox';

// interface getPractitionerAndBoxByUuidArgs {
//   practitionerBoxUuid: string;
// }

// interface getPractitionerAndBoxByLabelArgs {
//   practitionerId: number;
//   label: string;
// }

interface createTeatisBoxArgs {
  label: string;
  products: { id: number }[];
  description?: string;
  note?: string;
}

// interface getPractitionerRecurringBoxArgs {
//   practitionerId: number;
//   label: string;
// }

export interface TeatisBoxRepositoryInterface {
  // getPractitionerAndBoxByUuid({ practitionerBoxUuid }: getPractitionerAndBoxByUuidArgs):
  // Promise<ReturnValueType<PractitionerAndBox>>;

  // getPractitionerRecurringBox({ practitionerId, label }:getPractitionerRecurringBoxArgs):
  // Promise<ReturnValueType<PractitionerBox>>;

  // getPractitionerAndBoxByLabel({
  //   practitionerId,
  //   label,
  // }: getPractitionerAndBoxByLabelArgs): Promise<ReturnValueType<PractitionerAndBox>>;

  createTeatisBox({
    label,
    products,
    description,
    note,
  }: createTeatisBoxArgs): Promise<ReturnValueType<TeatisBox>>;
}

@Injectable()
export class TeatisBoxRepository
implements TeatisBoxRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  // async getPractitionerRecurringBox({ practitionerId, label }:getPractitionerRecurringBoxArgs):
  // Promise<ReturnValueType<PractitionerBox>>{
  //   const response = await this.prisma.practitionerBox.findUnique(
  //     {
  //       where: { PractitionerBoxIdentifier: { practitionerId, label: 'Recurring '+ label } },
  //       select: {
  //         id: true,
  //         uuid: true,
  //         label: true,
  //         description: true,
  //         note: true,
  //         intermediatePractitionerBoxProduct: {
  //           select: {
  //             product: {
  //               select: {
  //                 id: true,
  //                 externalSku: true,
  //                 name: true,
  //                 label: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //   const practitionerBox:PractitionerBox = {
  //     id: response.id,
  //     uuid: response.uuid,
  //     label: response.label,
  //     description: response.description,
  //     note: response.note,
  //     products: response.intermediatePractitionerBoxProduct.map(({ product }) => {
  //       return { id: product.id, label: product.label, sku: product.externalSku, name: product.name };
  //     }),
  //   };
  //   return [practitionerBox, undefined];
  // }

  async createTeatisBox({
    label,
    products,
    description,
    note,
  }: createTeatisBoxArgs): Promise<ReturnValueType<TeatisBox>> {
    const intermediateTable = this.prisma.intermediateTeatisBoxProduct;
    const teatisBoxTable = this.prisma.teatisBox;
    const existingProducts =
      await intermediateTable.findMany({
        where: { teatisBox: { AND: [{ label }] } },
        select: { product: true },
      });

    const existingProductIds = existingProducts.map(
      ({ product }) => product.id,
    );
    const newProductIds = products.map((product) => product.id);

    const [productIdsToAdd, productIdsToRemove] = calculateAddedAndDeletedIds(existingProductIds, newProductIds );

    await intermediateTable.deleteMany({
      where: {
        OR: productIdsToRemove.map((productId) => {
          return { productId };
        }),
        teatisBox: { AND: [{ label }] },
      },
    });
    const response = await teatisBoxTable.upsert({
      where: { label },
      create: {
        label,
        description,
        note,
        intermediateTeatisBoxProduct: {
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
        intermediateTeatisBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      select: {
        intermediateTeatisBoxProduct: { select: { product: true } },
        id: true,
        label: true,
      },
    });
    const boxProducts: Product[] =
      response.intermediateTeatisBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
        };
      });
    const teatisBox: TeatisBox = {
      id: response.id,
      label: response.label,
      products: boxProducts,
    };
    return [{ ...teatisBox }];
  }
  // async getPractitionerAndBoxByLabel({
  //   practitionerId,
  //   label,
  // }: getPractitionerAndBoxByLabelArgs): Promise<ReturnValueType<PractitionerAndBox>> {
  //   const response = await this.prisma.practitionerBox.findUnique({
  //     where: { PractitionerBoxIdentifier: { label, practitionerId } },
  //     select: {
  //       intermediatePractitionerBoxProduct: {
  //         select: {
  //           product: {
  //             select: {
  //               id: true,
  //               productVendor: { select: { label: true } },
  //               externalSku: true,
  //               productImages: { select: { id: true, src: true, position: true } },
  //               expertComment: true,
  //               label: true,
  //               name: true,
  //               productNutritionFact: true,
  //               ingredientLabel: true,
  //               allergenLabel: true,
  //             },
  //           },
  //         },
  //       },
  //       id: true,
  //       uuid: true,
  //       label: true,
  //       description: true,
  //       note: true,
  //       practitioner: {
  //         select: {
  //           practitionerSocialMedia: {
  //             select: {
  //               instagram: true,
  //               facebook: true,
  //               twitter: true,
  //               website: true,
  //             },
  //           },
  //           id: true,
  //           email: true,
  //           uuid: true,
  //           profileImage: true,
  //           firstName: true,
  //           lastName: true,
  //           middleName: true,
  //           message: true,
  //         },
  //       },
  //     },
  //   });

  //   if (
  //     !response?.practitioner ||
  //     !response?.intermediatePractitionerBoxProduct
  //   ) {
  //     return [
  //       undefined,
  //       {
  //         name: 'Internal Server Error',
  //         message: 'practitionerId/label is invalid',
  //       },
  //     ];
  //   }
  //   const socialMedia: SocialMedia =
  //     response.practitioner.practitionerSocialMedia;
  //   delete response.practitioner.practitionerSocialMedia;
  //   const practitioner: Practitioner = response.practitioner;
  //   const boxProducts: DisplayProduct[] = response
  //     .intermediatePractitionerBoxProduct.length
  //     ? response.intermediatePractitionerBoxProduct.map(({ product }) => {
  //       return {
  //         id: product.id,
  //         sku: product.externalSku,
  //         name: product.name,
  //         label: product.label,
  //         expertComment: product.expertComment,
  //         ingredientLabel: product.ingredientLabel,
  //         images: product.productImages,
  //         allergenLabel: product.allergenLabel,
  //         vendor: product.productVendor.label,
  //         nutritionFact: {
  //           calorie: product.productNutritionFact.calories,
  //           totalFat: product.productNutritionFact.totalFatG,
  //           saturatedFat: product.productNutritionFact.saturatedFatG,
  //           transFat: product.productNutritionFact.transFatG,
  //           cholesterole: product.productNutritionFact.cholesteroleMg,
  //           sodium: product.productNutritionFact.sodiumMg,
  //           totalCarbohydrate:
  //               product.productNutritionFact.totalCarbohydrateG,
  //           dietaryFiber: product.productNutritionFact.dietaryFiberG,
  //           totalSugar: product.productNutritionFact.totalSugarG,
  //           addedSugar: product.productNutritionFact.addedSugarG,
  //           protein: product.productNutritionFact.proteinG,
  //         },
  //       };
  //     })
  //     : [];

  //   const practitionerBox: PractitionerBox = {
  //     id: response.id,
  //     uuid: response.uuid,
  //     label: response.label,
  //     description: response.description,
  //     note: response.note,
  //     products: boxProducts,
  //   };
  //   return [
  //     {
  //       ...practitioner,
  //       ...socialMedia,
  //       box: { ...practitionerBox },
  //     },
  //   ];
  // }

  // async getPractitionerAndBoxByUuid({ practitionerBoxUuid }: getPractitionerAndBoxByUuidArgs):
  // Promise<ReturnValueType<PractitionerAndBox>> {
  //   const response = await this.prisma.practitionerBox.findUnique({
  //     where: { uuid: practitionerBoxUuid },
  //     select: {
  //       intermediatePractitionerBoxProduct: {
  //         select: {
  //           product: {
  //             select: {
  //               id: true,
  //               productVendor: { select: { label: true } },
  //               externalSku: true,
  //               productImages: { select: { id: true, src: true, position: true } },
  //               expertComment: true,
  //               label: true,
  //               name: true,
  //               productNutritionFact: true,
  //               ingredientLabel: true,
  //               allergenLabel: true,
  //             },
  //           },
  //         },
  //       },
  //       id: true,
  //       uuid: true,
  //       label: true,
  //       description: true,
  //       note: true,
  //       practitioner: {
  //         select: {
  //           practitionerSocialMedia: {
  //             select: {
  //               instagram: true,
  //               facebook: true,
  //               twitter: true,
  //               website: true,
  //             },
  //           },
  //           id: true,
  //           email: true,
  //           uuid: true,
  //           profileImage: true,
  //           firstName: true,
  //           lastName: true,
  //           middleName: true,
  //           message: true,
  //         },
  //       },
  //     },
  //   });

  //   if (
  //     !response?.practitioner ||
  //     !response?.intermediatePractitionerBoxProduct
  //   ) {
  //     return [
  //       undefined,
  //       {
  //         name: 'Internal Server Error',
  //         message: 'practitionerBoxUuid is invalid',
  //       },
  //     ];
  //   }

  //   const socialMedia: SocialMedia =
  //     response.practitioner.practitionerSocialMedia;
  //   delete response.practitioner.practitionerSocialMedia;
  //   const practitioner: Practitioner = response.practitioner;
  //   const boxProducts: DisplayProduct[] = response
  //     .intermediatePractitionerBoxProduct.length
  //     ? response.intermediatePractitionerBoxProduct.map(({ product }) => {
  //       return {
  //         id: product.id,
  //         sku: product.externalSku,
  //         name: product.name,
  //         label: product.label,
  //         expertComment: product.expertComment,
  //         ingredientLabel: product.ingredientLabel,
  //         images: product.productImages,
  //         allergenLabel: product.allergenLabel,
  //         vendor: product.productVendor.label,
  //         nutritionFact: {
  //           calorie: product.productNutritionFact.calories,
  //           totalFat: product.productNutritionFact.totalFatG,
  //           saturatedFat: product.productNutritionFact.saturatedFatG,
  //           transFat: product.productNutritionFact.transFatG,
  //           cholesterole: product.productNutritionFact.cholesteroleMg,
  //           sodium: product.productNutritionFact.sodiumMg,
  //           totalCarbohydrate:
  //               product.productNutritionFact.totalCarbohydrateG,
  //           dietaryFiber: product.productNutritionFact.dietaryFiberG,
  //           totalSugar: product.productNutritionFact.totalSugarG,
  //           addedSugar: product.productNutritionFact.addedSugarG,
  //           protein: product.productNutritionFact.proteinG,
  //         },
  //       };
  //     })
  //     : [];

  //   const practitionerBox: PractitionerBox = {
  //     id: response.id,
  //     uuid: response.uuid,
  //     label: response.label,
  //     description: response.description,
  //     note: response.note,
  //     products: boxProducts,
  //   };
  //   return [
  //     {
  //       ...practitioner,
  //       ...socialMedia,
  //       box: { ...practitionerBox },
  //     },
  //   ];
  // }
}
