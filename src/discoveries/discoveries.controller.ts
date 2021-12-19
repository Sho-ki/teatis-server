import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { DiscoveriesService } from './discoveries.service';

@Controller('discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(private discoveriesService: DiscoveriesService) {}

  @Get()
  createDiscovery(@Query() body: CreateDiscoveryInfoDto) {
    return this.discoveriesService.createDiscovery(body);
  }
}
