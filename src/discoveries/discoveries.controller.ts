import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { DiscoveriesService } from './discoveries.service';
import { v4 as uuidv4 } from 'uuid';
import { TeatisJobs } from '../repositories/teatisJobs/dbMigrationjob';
import { getPostPurchaseSurveyInfoDto } from './dtos/get-post-purchase-survey';

@Controller('discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    private discoveriesService: DiscoveriesService,
    private teatisJob: TeatisJobs,
  ) {}

  @Get()
  createDiscovery(@Query() body: CreateDiscoveryInfoDto) {
    return this.discoveriesService.createDiscovery(body);
  }

  @Get('post-purchase-survey')
  getPostPurchaseSurvey(@Body() body: getPostPurchaseSurveyInfoDto) {
    this.discoveriesService.getPostPurchaseSurvey(body);
  }

  @Post('webhook')
  getWebhook(@Body() test) {
    console.log(test);
    console.log('WE GOT A WEBHOOK');
  }

  @Get('typeform')
  @Redirect()
  redirectToTypeform() {
    const uuid = uuidv4();
    const TYPEFORM_URL_ID = process.env.TYPEFORM_URL_ID;
    return {
      url: `https://teatis.typeform.com/to/${TYPEFORM_URL_ID}#typeformid=${uuid}`,
    };
  }

  // When you migrate the data (Discoveries -> Customer etc...)
  // @Post('job')
  // async dataMigrate() {
  //   if (process.env.engine === 'local') {
  //     await this.teatisJob.databaseMigrate();
  //   }
  //   return;
  // }
}
