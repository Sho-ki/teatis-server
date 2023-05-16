import { IsDate, IsNumber, IsString } from 'class-validator';

export class PostCustomerActionStepRequestDto {
    @IsString()
      uuid: string;

    @IsNumber()
      actionStepId: number;

    @IsDate()
      date: Date = new Date();
}

