import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailUsecaseInterface } from '@Usecases/sendEmail/sendEmail';
import { PostCustomerInformationDto } from '../dtos/postCustomerInformation';

@Controller('api/discovery')
export class EmailController {
  constructor(
    @Inject('EmailUsecaseInterface')
    private emailUsecase: EmailUsecaseInterface
  ) {}

  // POST: api/discovery/email
  @Post('email')
  async postCustomerInformation(
    @Body() body: PostCustomerInformationDto,
    @Res() response: Response,
  ) {
    const [_, error] = await this.emailUsecase.postCustomerInformation(body)
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
  // DELETE: api/discovery/email
  @Delete('email')
  async deleteUserInformation(
    @Body() body: Partial<PostCustomerInformationDto>,
    @Res() response: Response,
  ) {
    const [_, error] = await this.emailUsecase.deleteUserInformation({
      email: body.email, 
      klaviyoListName: body.klaviyoListName
    })
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
}
