import { Module } from '@nestjs/common';
import { TransactionOperator } from '@Repositories/utils/transactionOperator';
import { MicroGoalController } from './microGoal.controller';
import { SetCustomerMicroGoalsUsecase } from '../../usecases/microGoal/setCustomerMicroGoals.usecase';

@Module({
  controllers: [MicroGoalController],
  exports: [MicroGoalController],
  providers: [
    {
      provide: 'SetCustomerMicroGoalsUsecaseInterface',
      useClass: SetCustomerMicroGoalsUsecase,
    },
    {
      provide: 'TransactionOperatorInterface',
      useClass: TransactionOperator,
    },
    MicroGoalController,
  ],
})
export class  MicroGoalModule {}
