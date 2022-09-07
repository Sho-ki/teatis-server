import { TerraCustomer } from './TerraCustomer';

export interface GlucoseLog extends TerraCustomer{
    terraCustomerKeyId:number | null;
    data:GlucoseLogData[];
}

export interface GlucoseLogData{
    glucoseValue: number;
    timestamp: string;
    timestampUtc:Date;
}
