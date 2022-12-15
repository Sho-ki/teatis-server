import {  Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { exec } from 'child_process';

@Controller('api/cloud-scheduler/twilio')
export class TwilioController {
  constructor( ) {}

  // POST: api/cloud-scheduler/twilio/send-auto-message
  @Post('send-auto-message')
  async sendAutoMessage(@Body('command') command:string, @Res() response: Response<string>) {
    // Include the command in body of the request to avoid to be accessed when endpoints are leaked.
    exec(command);

    return response.send('OK');
  }
}
