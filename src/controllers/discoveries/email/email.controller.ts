import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostCustomerInformationDto } from '../dtos/postCustomerInformation';
import { PostEmailUsecaseInterface } from '@Usecases/email/postCustomerEmail';

@Controller('api/discovery')
export class EmailController {
  constructor(
    @Inject('PostEmailUsecaseInterface')
    private postEmailUsecase: PostEmailUsecaseInterface
  ) {}

  // POST: api/discovery/email
  @Post('email')
  async postCustomerInformation(
    @Body() body: PostCustomerInformationDto,
    @Res() response: Response,
  ) {
    const serverSideUrl = body.klaviyoListName === 'PotentialCustomer'
      ? `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`
      : `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_PRACTITIONER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;
    const [_, error] = await this.postEmailUsecase.postCustomerInformation({...body, serverSideUrl})
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
  // // DELETE: api/discovery/email
  // @Delete('email')
  // async deleteUserInformation(
  //   @Body() body: Partial<PostCustomerInformationDto>,
  //   @Res() response: Response,
  // ) {
  //   const [_, error] = await this.emailUsecase.deleteUserInformation({
  //     email: body.email, 
  //     klaviyoListName: body.klaviyoListName
  //   })
  //   if (error) {
  //     return response.status(500).send(error);
  //   }
  //   return response.status(200).send('klaviyo list updated successfully')
  // }
}
