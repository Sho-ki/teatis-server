import { PostCustomerInformationDto } from "@Controllers/discoveries/dtos/postCustomerInformation";
import { Injectable } from "@nestjs/common";
import axios from "axios";

interface PostCustomerInformationArgs { 
    email:string;
    customerUuid:string;
    recommendBoxType:string;
    serverSideUrl: string;
}
export interface KlaviyoRepositoryInterface {
    postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationArgs): Promise<[void, Error]>;
    deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]>;
}

@Injectable()
export class KlaviyoRepository implements KlaviyoRepositoryInterface {
    async postCustomerInformation({email, customerUuid, recommendBoxType, serverSideUrl}: PostCustomerInformationArgs): Promise<[void, Error]> {
        if (!serverSideUrl) return [null, {name: 'klaviyo list name not provided', message: 'please provide klaviyo list name'}]
        const userProfiles = {"profiles": [{email, customerUuid, recommendBoxType}]}
        const response = await axios.post(serverSideUrl, userProfiles).catch(error => error)
        if (response.status !== 200) return [null, {name: `${response.name}: Klaviyo postUserInfo`, message: response.message}];
        return [null, null];
    }
    async deleteUserInformation({email, klaviyoListName}: Partial<PostCustomerInformationDto>): Promise<[void, Error]> {
        let klaviyoPostURL;
        switch (klaviyoListName) {
            case "PotentialCustomer":
                klaviyoPostURL = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`
                break
            case "PotentialCustomerPractitioner":
                klaviyoPostURL = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.KLAVIYO_API}`
                break
        }
        const userProfile = {"emails": [email]}
        const response = await axios.delete(klaviyoPostURL, {data: userProfile}).catch(error => error)
        if (response.status !== 200) return [null, {name: `${response.name}: Klaviyo deleteUserInformation`, message: response.message}];
        return [null, null];
    }
}
