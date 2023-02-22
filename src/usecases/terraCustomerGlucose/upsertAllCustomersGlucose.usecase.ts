import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TerraRepositoryInterface } from '@Repositories/terra/terra.repository';
import { TerraCustomerRepositoryInterface } from '../../repositories/teatisDB/terraCustomer/terraCustomer.repository';
import { Status } from '../../domains/Status';
import {  GlucoseLogData } from '../../domains/GlucoseLog';

export interface UpsertAllCustomersGlucoseUsecaseInterface {
  upsertAllCustomersGlucose(): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class UpsertAllCustomersGlucoseUsecase
implements UpsertAllCustomersGlucoseUsecaseInterface
{
  private errorStack:Error[] =[];
  constructor(
    @Inject('TerraRepositoryInterface')
    private readonly terraRepository: TerraRepositoryInterface,
    @Inject('TerraCustomerRepositoryInterface')
    private readonly terraCustomerRepository: TerraCustomerRepositoryInterface,

  ) {}

  async upsertAllCustomersGlucose(): Promise<ReturnValueType<Status>> {
    const [terraCustomers, getAllCustomersError] = await this.terraCustomerRepository.getActiveTerraCustomers();
    if(getAllCustomersError){
      return [undefined, getAllCustomersError];
    }
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().slice(0, 10);
    for(const { terraCustomerId  } of terraCustomers){
      try{
        const [[newGlucoseLogs, getNewGlucoseLogsError], [existingGlucoseLogs]]
        = await Promise.all([
          this.terraRepository.getCustomerGlucoseLogs(
            { terraCustomerId, date }
          ),
          this.terraCustomerRepository.getCustomerGlucoseLogs({ terraCustomerId }),
        ]);

        if(getNewGlucoseLogsError){
          this.errorStack.push(getNewGlucoseLogsError);
          continue;
        }
        if(!newGlucoseLogs.data.length) continue;

        const glucoseLogsToAdd:GlucoseLogData[] =
      existingGlucoseLogs?.data ? newGlucoseLogs.data.filter(({ timestamp }) =>
      { return !existingGlucoseLogs?.data?.find(({ timestamp: existingData }) => existingData === timestamp); })
      :newGlucoseLogs.data;

        const duplicateRemovedLogs = glucoseLogsToAdd.
          filter((value, index, self) => self.findIndex(value2 => (value2.timestamp===value.timestamp))===index);

        const setTimestampToLocalData = duplicateRemovedLogs.map((value) => {
        // "YYYY-MM-DDTHH:MM:SS.000000-04:00"
          const deepCopy = new Date(value.timestamp);
          const utcDifference = String(value.timestamp).split('000000')[1].slice(0, 3);
          deepCopy.setHours(deepCopy.getHours() + Number(utcDifference));
          return { ...value, timestamp: deepCopy };
        });
        await this.terraCustomerRepository.addCustomerGlucoseLogs(
          { terraCustomerKeyId: existingGlucoseLogs.terraCustomerKeyId, data: setTimestampToLocalData  });
      }catch(error){
        this.errorStack.push(error);
      }
    }
    if(this.errorStack.length){
      throw [undefined, { name: 'Error', message: 'Error in upsertAllCustomersGlucose', stack: JSON.stringify(this.errorStack) }];
    }
    return [{ success: true }];
  }
}
