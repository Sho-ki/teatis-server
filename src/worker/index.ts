/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { executeUpdateOrder } from './order/updateOrder.worker';
import { executeSendAutoMessage } from './twilio/sendAutoMessage.worker';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports.sendAutoMessage = async (req: Request, res: Response) => {
  await executeSendAutoMessage(req.method);
  res.end();
};

module.exports.updateOrder = async (req: Request, res: Response) => {
  await executeUpdateOrder(req.method);
  res.end();
};

const executeFunctionManually = async() => {
  const workName = process.argv[2];
  switch(workName){
    case 'order':
      await executeUpdateOrder('POST');
      break;
    case 'twilio':
      await executeSendAutoMessage('POST');
      break;
  }
};

executeFunctionManually();
