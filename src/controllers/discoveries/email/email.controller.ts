import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { DeleteCustomerInformationDto } from '../dtos/deleteCustomerInformation';
import { DeleteEmailUsecaseInterface } from '@Usecases/email/deleteEmail';
import { PostCustomerInformationDto } from '../dtos/postCustomerInformation';
import { PostEmailUsecaseInterface } from '@Usecases/email/postCustomerEmail';
import { Response } from 'express';
import { Status } from '@Domains/Status';
import { KlaviyoListNames } from '@Domains/KlaviyoListNames';

@Controller('api/discovery')
export class EmailController {
  constructor(
    @Inject('PostEmailUsecaseInterface')
    private postEmailUsecase: PostEmailUsecaseInterface,
    @Inject('DeleteEmailUsecaseInterface')
    private deleteEmailUsecase: DeleteEmailUsecaseInterface
  ) {}

  // POST: api/discovery/email
  @Post('email')
  async postCustomerInformation(
    @Body() body: PostCustomerInformationDto,
    @Res() response: Response<Status | Error>,
  ) {
    let serverSideUrl;
    switch(body.klaviyoListName) {
      case KlaviyoListNames.POTENTIAL_CUSTOMER:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
      case KlaviyoListNames.POTENTIAL_CUSTOMER_PRACTITIONER:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
      case KlaviyoListNames.POTENTIAL_CUSTOMER_CGM:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_CGM_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
    }
    const [usecaseResponse, error] = await this.postEmailUsecase.postCustomerInformation({ ...body, serverSideUrl });
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
  // DELETE: api/discovery/email
  @Delete('email')
  async deleteUserInformation(
    @Body() body: DeleteCustomerInformationDto,
    @Res() response: Response<Status | Error>,
  ) {
    let serverSideUrl;
    switch(body.klaviyoListName) {
      case KlaviyoListNames.POTENTIAL_CUSTOMER:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
      case KlaviyoListNames.POTENTIAL_CUSTOMER_PRACTITIONER:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
      case KlaviyoListNames.POTENTIAL_CUSTOMER_CGM:
        serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_CGM_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
        break;
    }
    const [usecaseResponse, error] = await this.deleteEmailUsecase.deleteUserInformation({ ...body, serverSideUrl });
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
}
