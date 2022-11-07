import { Customer } from './Customer';

export interface CustomerAuth extends Customer {
  token: string;
  tokenType?:'bearer';
  refreshToken:string;
  expiredAt:Date;
  isAuthenticated?: boolean;
}
