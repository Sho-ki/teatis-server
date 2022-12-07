export interface TwilioCustomerDetail {
    objects:{
        customer:{
            customer_id: number;
            display_name: string;
            channels:{ type: 'sms', value: string }[];
        links?:{
            type: string;
            value:string;
            display_name: string;
        }[];
        details?: {
            title: string;
            content:string;
        };
        worker: string; // assign this customer to a worker
        address: string;
    };
};

}
