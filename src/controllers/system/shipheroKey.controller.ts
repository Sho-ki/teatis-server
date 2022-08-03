import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { UpdateShipheoKeyUsecaseInterface } from '@Usecases/shipheroKey/updateShipheroKey.usecase';
import { Response } from 'express';

@Controller('api/system')
export class ShipheroKeyController {
  constructor(
    @Inject('UpdateShipheoKeyUsecaseInterface')
    private updateShipheoKeyUsecaseInterface: UpdateShipheoKeyUsecaseInterface,
  ) {}
  @Post('shiphero-key')
  async updateShipherokey(@Res() response: Response): Promise<Response> {
    const [usecaseResponse, error] =
      await this.updateShipheoKeyUsecaseInterface.updateShipheroKey();
    if (error) {
      return response.status(500).send(usecaseResponse);
    }
    return response.status(200).send({ status: 'OK' });
  }
}
