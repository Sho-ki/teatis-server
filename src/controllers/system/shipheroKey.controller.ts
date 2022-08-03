import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { UpdateShipheoKeyUsecaseInterface } from '@Usecases/shipheroKey/updateShipheroKey.usecase';
import { Response } from 'express';
import { Status } from '@Domains/Status';

@Controller('api/system')
export class ShipheroKeyController {
  constructor(
    @Inject('UpdateShipheoKeyUsecaseInterface')
    private updateShipheoKeyUsecaseInterface: UpdateShipheoKeyUsecaseInterface,
  ) {}
  @Post('shiphero-key')
  async updateShipherokey(@Res() response: Response<Status | Error>) {
    const [usecaseResponse, error] =
      await this.updateShipheoKeyUsecaseInterface.updateShipheroKey();
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
}
