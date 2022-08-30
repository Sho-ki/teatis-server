import { Controller, Inject, Query, Get, Redirect } from '@nestjs/common';
import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';

@Controller('api/terra')
export class TerraController {
  constructor(
    @Inject('GetTerraAuthUrlUsecaseInterface')
    private getTerraAuthUrlUsecaseInterface: GetTerraAuthUrlUsecaseInterface,
  ) {}

  @Get('auth-url')
  @Redirect('', 307)
  async getTerraAuthUr(@Query('uuid') uuid: string) {
    const [usecaseResponse, error] =
      await this.getTerraAuthUrlUsecaseInterface.getTerraAuthUrl(uuid);
    if (error) {
      return { url: 'google.com' };
    }
    return { url: usecaseResponse.url };
  }
}
