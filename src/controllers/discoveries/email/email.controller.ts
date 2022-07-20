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
    @Res() response: Response,
  ) {
    const serverSideUrl = body.klaviyoListName === 'PotentialCustomer'
      ? `https://a.klaviyo.com/api/v2/list/${process.env.SANITY_STUDIO_KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.SANITY_STUDIO_KLAVIYO_API}`
      : `https://a.klaviyo.com/api/v2/list/${process.env.SANITY_STUDIO_KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.SANITY_STUDIO_KLAVIYO_API}`;
    const [_, error] = await this.postEmailUsecase.postCustomerInformation({...body, serverSideUrl})
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
  // DELETE: api/discovery/email
  @Delete('email')
  async deleteUserInformation(
    @Body() body: DeleteCustomerInformationDto,
    @Res() response: Response,
  ) {
    const serverSideUrl = body.klaviyoListName === 'PotentialCustomer'
      ? `https://a.klaviyo.com/api/v2/list/${process.env.SANITY_STUDIO_KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.SANITY_STUDIO_KLAVIYO_API}`
      : `https://a.klaviyo.com/api/v2/list/${process.env.SANITY_STUDIO_KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.SANITY_STUDIO_KLAVIYO_API}`;
    const [_, error] = await this.deleteEmailUsecase.deleteUserInformation({...body, serverSideUrl})
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
}
