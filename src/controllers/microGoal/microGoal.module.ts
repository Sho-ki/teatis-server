import { Module } from '@nestjs/common';
import { MicroGoalController } from './microGoal.controller';
import { SetCustomerMicroGoalsUsecase } from '../../usecases/microGoal/setCustomerMicroGoals.usecase';
import { GetCustomerMicroGoalsUsecase } from '../../usecases/microGoal/getCustomerMicroGoals.usecase';
import { LogCustomerActionStepUsecase } from '../../usecases/customerActionStep/logCustomerActionStep.usecase';

@Module({
  controllers: [MicroGoalController],
  exports: [MicroGoalController],
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

    MicroGoalController,
  ],
})
export class MicroGoalModule {}
