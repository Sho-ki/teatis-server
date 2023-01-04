export interface Customer {
  id: number;
  uuid: string;
  email: string;
  phone?:string;
  firstName?:string;
  lastName?:string;
  middleName?:string;
  coachingStatus?: 'active' | 'inactive' | 'pending';
  boxStatus?: 'active' | 'inactive'| 'pending';
  twilioChannelSid?:string;
  sequenceBasedAutoMessageInterval?:number;
  coachId?:number;
  note?:string;
  createdAt?: Date;
  updatedAt?: Date;
}
