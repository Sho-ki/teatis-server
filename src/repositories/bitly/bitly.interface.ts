/* eslint-disable @typescript-eslint/no-explicit-any */
export declare namespace CreateShorterUrlResponse {

    export interface References {
        group: string;
    }

    export interface RootObject {
        created_at: Date;
        id: string;
        link: string;
        custom_bitlinks: any[];
        long_url: string;
        archived: boolean;
        tags: any[];
        deeplinks: any[];
        references: References;
    }

}

