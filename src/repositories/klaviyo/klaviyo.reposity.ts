import { Injectable } from "@nestjs/common";
import axios from "axios";

export interface KlaviyoRepositoryInterface {
    postUserInfo(email: string, customerUuid: string, recommendBoxType: string): Promise<Error>;
}


@Injectable()
export class KlaviyoRepository {
    async postUserInfo(email: string, customerUuid: string, recommendBoxType: string): Promise<Error> {
        const klaviyoPostURL = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_LIST}/members?api_key=${process.env.KLAVIYO_API}`
        const response = await axios.post(klaviyoPostURL, {"profiles": [{email, customerUuid, recommendBoxType}]}).catch(error => error.toJSON())
        if (response.status !== 200) return response;
        return null;
    }
}
