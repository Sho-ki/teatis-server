import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertProductDto {
  @IsString()
  @IsOptional()
  activeStatus?: 'active' | 'inactive';

  @IsString()
  @IsOptional()
  style?: 'normal' | 'refrigerated' | 'frozen';

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
  @IsOptional()
  name?: string;

  @IsNumber()
  productProviderId: number;

  @IsString()
  @IsOptional()
  upcCode?: string;

  @IsNumber()
  @IsOptional()
  flavorId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  vendorId?: number;

  @IsString()
  externalSku: string;

  @IsArray()
  @IsOptional()
  allergenIds?: number[];

  @IsArray()
  @IsOptional()
  foodTypeIds?: number[];

  @IsArray()
  @IsOptional()
  images?: { src: string; position: number }[];

  @IsArray()
  @IsOptional()
  ingredientIds?: number[];

  @IsArray()
  @IsOptional()
  cookingMethodIds?: number[];

  @IsObject()
  nutritionFact: {
    quantity: number;
    servingSize: number;
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterole: number;
    sodium: number;
    totalCarbohydrate: number;
    dietaryFiber: number;
    totalSugar: number;
    addedSugar: number;
    protein: number;
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    spicy: number;
    texture: string;
  };
}
