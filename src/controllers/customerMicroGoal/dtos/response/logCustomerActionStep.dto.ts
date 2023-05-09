import { Expose } from 'class-transformer';

export namespace LogCustomerActionStepResponseDto {
  export class Main {
    @Expose()
      id: number;

    @Expose()
      customerId: number;

    @Expose()
      completedAt: Date;
  }

}
