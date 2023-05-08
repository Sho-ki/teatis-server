import { Module } from '@nestjs/common';
import { MicroGoalController } from './microGoal.controller';
import { SetCustomerMicroGoalsUsecase } from '../../usecases/microGoal/setCustomerMicroGoals.usecase';
import { GetCustomerMicroGoalsUsecase } from '../../usecases/microGoal/getCustomerMicroGoals.usecase';

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
    MicroGoalController,
  ],
})
export class MicroGoalModule {}
