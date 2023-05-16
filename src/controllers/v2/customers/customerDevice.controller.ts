import { Controller, Get, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { GetCustomerDeviceRequestDto } from './dtos/GetCustomerDevice.dto';
import { GetCustomersGlucoseUsecaseInterface } from '../../../usecases/terraCustomerGlucose/getCustomerGlucose.usecase';
import { GlucoseLogsDto } from '../../ResponseDtos/GlucoseLogs.dto';
import { Serialize } from '../../../interceptors/serialize.interceptor';

@Controller('api/v2/customers/devices')
export class CustomerDeviceController {
  constructor(
@Inject('GetCustomersGlucoseUsecaseInterface')
  private readonly getCustomersGlucoseUsecase :GetCustomersGlucoseUsecaseInterface
  ) {}

  // GET: api/v2/customers/devices
  @Get()
  @Serialize(GlucoseLogsDto)
  async getCustomerDevice(
    @Query() query: GetCustomerDeviceRequestDto,
  ) {
    const [usecase, error] = await this.getCustomersGlucoseUsecase.execute(query);

    if(error){
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return usecase;
  }

}
