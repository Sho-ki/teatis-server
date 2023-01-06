import { IsObject } from 'class-validator';

export class CancelSubscriptionDto {
  @IsObject()
    subscription: {customer_id:number, email:string};

}
