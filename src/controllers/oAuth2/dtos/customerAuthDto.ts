import { Exclude, Expose } from 'class-transformer';

export class CustomerAuthDto {
@Expose()
  id:number;

@Expose()
  email:string;

@Expose()
  uuid:string;

@Expose()
  isAuthenticated:boolean;

@Exclude()
  token: string;

@Exclude()
  tokenType?:'bearer';

@Exclude()
  refreshToken:string;

@Exclude()
  expiredAt:Date;
}
