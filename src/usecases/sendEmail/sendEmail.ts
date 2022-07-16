import { Injectable } from "@nestjs/common";
import { KlaviyoRepository } from "@Repositories/klaviyo/klaviyo.reposity";

export interface SendEmailUseCaseInterface {
    postUserInfo(email: string, customerUuid: string, recommendBoxType: string): Promise<Error>;
}

@Injectable()
export class SendEmailUseCase implements SendEmailUseCaseInterface {
    constructor(
        private klaviyoRepository: KlaviyoRepository
    ){}
    async postUserInfo(email: string, customerUuid: string, recommendBoxType: string) {
        const error = await this.klaviyoRepository.postUserInfo(email, customerUuid, recommendBoxType);
        return error || null;
    }
}
