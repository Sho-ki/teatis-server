/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { Request, Response } from 'express';
import { executeUpdateOrder } from './updateOrder/updateOrder.worker';
import { executeSendAutoMessage } from './sendAutoMessage/sendAutoMessage.worker';
import { executeCreateEmployeeOrder } from './createEmployeeOrder/createEmployeeOrder.worker';

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

module.exports.createEmployeeOrder = async (req: Request, res: Response) => {
  await executeCreateEmployeeOrder(req.method);
  res.end();
};

const executeFunctionManually = async() => {
  const workName = process.argv[2];
  switch(workName){
    case 'updateOrder':
      await executeUpdateOrder('POST');
      break;
    case 'sendAutoMessage':
      await executeSendAutoMessage('POST');
      break;
    case 'createEmployeeOrder':
      await executeCreateEmployeeOrder('POST');
      break;
  }
};

executeFunctionManually();
