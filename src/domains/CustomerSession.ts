import { Customer } from './Customer';

export interface CustomerSession extends Customer{
    sessionId:string;
    expiredAt?:Date;
    activeUntil:Date;
}
