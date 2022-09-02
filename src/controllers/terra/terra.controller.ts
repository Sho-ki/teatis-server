import { Controller, Inject, Query, Get, Redirect, Post, Body } from '@nestjs/common';
import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
import { UpsertAllCustomersGlucoseUsecaseInterface } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';

@Controller('api/terra')
export class TerraController {
  constructor(
    @Inject('GetTerraAuthUrlUsecaseInterface')
    private getTerraAuthUrlUsecaseInterface: GetTerraAuthUrlUsecaseInterface,
    @Inject('UpsertAllCustomersGlucoseUsecaseInterface')
    private upsertAllCustomersGlucoseUsecase: UpsertAllCustomersGlucoseUsecaseInterface,

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

  // Get: api/discovery/customer-glucose
  @Post('customer-glucose')
  async postCustomerGlucose() {
    const [usecaseResponse, error] = await this.upsertAllCustomersGlucoseUsecase.upsertAllCustomersGlucose();
    if(error){
      return [undefined, error];
    }

  }

}
