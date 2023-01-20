import { CustomerOAuth2 } from '@prisma/client';
import { Customer } from './Customer';

export interface CustomerAuth extends CustomerOAuth2{
  customer:Customer;
}

export interface CustomerIsAuthenticated extends Customer{
  isAuthenticated:boolean;

}
