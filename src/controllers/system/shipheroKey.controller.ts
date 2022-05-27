import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { UpdateShipheoKeyUsecaseInterface } from '../../usecases/shipheroKey/updateShipheroKey.usecase';
import { Response } from 'express';

@Controller('api/system')
export class ShipheroKeyController {
  constructor(
    @Inject('UpdateShipheoKeyUsecaseInterface')
    private updateShipheoKeyUsecaseInterface: UpdateShipheoKeyUsecaseInterface,
  ) {}
  @Post('shiphero-key')
  async updateShipherokey(
    @Body() body: any,
    @Res() response: Response,
  ): Promise<any> {
    const [res, error] =
      await this.updateShipheoKeyUsecaseInterface.updateShipheroKey();
    return response.status(200).send({ statu: 'OK' });
  }
}
