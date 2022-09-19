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

  @IsObject()
  @IsOptional()
    nutritionFact: {
    quantity?: number;
    servingSize?: number;
    calories?: number;
    totalFat?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterole?: number;
    sodium?: number;
    totalCarbohydrate?: number;
    dietaryFiber?: number;
    totalSugar?: number;
    addedSugar?: number;
    sugarAlcohol?: number;
    protein?: number;
    sweet?: number;
    sour?: number;
    salty?: number;
    bitter?: number;
    spicy?: number;
    texture?: string;
  };
}
