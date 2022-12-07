export interface Customer {
  id: number;
  uuid: string;
  email: string;
  phone?:string;
  firstName?:string;
  lastName?:string;
  middleName?:string;
  createAt?: Date;
  updatedAt?: Date;
}
