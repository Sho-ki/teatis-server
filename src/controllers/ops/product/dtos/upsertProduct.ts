import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertProductDto {
  @IsString()
    activeStatus: 'active' | 'inactive';

  @IsString()
    preservationStyle: 'normal' | 'refrigerated' | 'frozen';

  @IsString()
  @IsOptional()
    allergenLabel?: string;

  @IsString()
  @IsOptional()
    ingredientLabel?: string;

  @IsString()
  @IsOptional()
    expertComment?: string;

  @IsArray()
  @IsOptional()
    glucoseValues?: number[];

  @IsNumber()
  @IsOptional()
    WSP?: number;

  @IsNumber()
  @IsOptional()
    MSP?: number;

  @IsString()
    label: string;

  @IsString()
    name: string;

  @IsNumber()
    productProviderId: number;

  @IsString()
  @IsOptional()
    upcCode?: string;

  @IsNumber()
    flavorId: number;

  @IsNumber()
    categoryId: number;

  @IsNumber()
    vendorId: number;

  @IsString()
    externalSku: string;

  @IsArray()
    allergenIds: number[];

  @IsArray()
    foodTypeIds: number[];

  @IsArray()
    images: { src: string, position: number }[];

  @IsArray()
    ingredientIds: number[];

  @IsArray()
    cookingMethodIds: number[];

  @IsNumber()
  @IsOptional()
    weight?: number;

  @IsObject()
    nutritionFact: {
    quantity: number | null;
    servingSize: number | null;
    calories: number | null;
    totalFat: number | null;
    saturatedFat: number | null;
    transFat: number | null;
    cholesterole: number | null;
    sodium: number | null;
    totalCarbohydrate: number | null;
    dietaryFiber: number | null;
    totalSugar: number | null;
    addedSugar: number | null;
    sugarAlcohol: number | null;
    protein: number | null;
    sweet: number | null;
    sour: number | null;
    salty: number | null;
    bitter: number | null;
    spicy: number | null;
    texture: string | null;
  };
}
