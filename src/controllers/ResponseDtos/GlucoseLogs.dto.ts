import { Expose } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class GlucoseLogDto {
  @Expose()
    id: number;

  @Expose()
    terraCustomerKeyId: number;

  @Expose()
    timestamp: Date;

  @Expose()
    timestampUtc: Date;

  @Expose()
    glucoseValue: number;

}

export class GlucoseLogsDto {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
    glucoseLogs: GlucoseLogDto[];

}
