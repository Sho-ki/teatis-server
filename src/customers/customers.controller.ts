import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCustomerInfoDto } from './dtos/create-customer.dto';
import { CustomersService } from './customers.service';

@Controller('customer')
@UsePipes(new ValidationPipe({ transform: true }))
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  createCustomer(@Query() body: CreateCustomerInfoDto) {
    return this.customersService.createCustomer(body);
  }
}
