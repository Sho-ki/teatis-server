export interface Customer {
  id: number;
  uuid: string;
  email: string;
  phone?:string;
  firstName?:string;
  lastName?:string;
  middleName?:string;
  coachingSubscribed?: 'active' | 'inactive' | 'pending';
  boxSubscribed?: 'active' | 'inactive'| 'pending';
  twilioChannelSid?:string;
  sequenceBasedAutoMessageInterval?:number;
  coachId?:number;
  note?:string;
  createdAt?: Date;
  updatedAt?: Date;
  totalPoints?: number;
}
