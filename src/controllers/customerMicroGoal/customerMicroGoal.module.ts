import { Module } from '@nestjs/common';
import { CustomerMicroGoalController } from './customerMicroGoal.controller';
import { SetCustomerMicroGoalsUsecase } from '../../usecases/customerMicroGoal/setCustomerMicroGoals.usecase';
import { GetCustomerMicroGoalsUsecase } from '../../usecases/customerMicroGoal/getCustomerMicroGoals.usecase';
import { LogCustomerActionStepUsecase } from '../../usecases/customerActionStep/logCustomerActionStep.usecase';

@Module({
  controllers: [CustomerMicroGoalController],
  exports: [CustomerMicroGoalController],
  providers: [
    {
      provide: 'GetCustomerMicroGoalsUsecaseInterface',
      useClass: GetCustomerMicroGoalsUsecase,
    },
    {
      provide: 'SetCustomerMicroGoalsUsecaseInterface',
      useClass: SetCustomerMicroGoalsUsecase,
    },
    {
      provide: 'LogCustomerActionStepUsecaseInterface',
      useClass: LogCustomerActionStepUsecase,
    },

    CustomerMicroGoalController,
  ],
})
export class CustomerMicroGoalModule {}
