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
import { PostUserInformationDto } from '../dtos/postUserInformation';

@Controller('api/discovery')
export class EmailController {
  constructor(
    @Inject('EmailUsecaseInterface')
    private emailUsecase: EmailUsecaseInterface
  ) {}

  // POST: api/discovery/email
  @Post('email')
  async getPractitionerBox(
    @Body() body: PostUserInformationDto,
    @Res() response: Response,
  ) {
    const [_, error] = await this.emailUsecase.postUserInfo({
      email: body.email, 
      customerUuid: body.customerUuid, 
      recommendBoxType: body.recommendBoxType, 
      klaviyoListName: body.klaviyoListName
    })
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send('klaviyo list updated successfully')
  }
  // DELETE: api/discovery/email
  @Delete('email')
  async deletePractitionerBox(
    @Body() body: Partial<PostUserInformationDto>,
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