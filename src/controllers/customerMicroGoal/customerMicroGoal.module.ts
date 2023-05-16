import { Module } from '@nestjs/common';
import { CustomerMicroGoalController } from './customerMicroGoal.controller';
import { PostCustomerMicroGoalsUsecase } from '../../usecases/customerMicroGoal/postCustomerMicroGoals.usecase';
import { GetCustomerMicroGoalsUsecase } from '../../usecases/customerMicroGoal/getCustomerMicroGoals.usecase';
import { PostCustomerActionStepUsecase } from '../../usecases/customerActionStep/postCustomerActionStep.usecase';

@Module({
  controllers: [CustomerMicroGoalController],
  exports: [CustomerMicroGoalController],
  providers: [
    {
      provide: 'GetCustomerMicroGoalsUsecaseInterface',
      useClass: GetCustomerMicroGoalsUsecase,
    },
    {
      provide: 'PostCustomerMicroGoalsUsecaseInterface',
      useClass: PostCustomerMicroGoalsUsecase,
    },
    {
      provide: 'PostCustomerActionStepUsecaseInterface',
      useClass: PostCustomerActionStepUsecase,
    },

    CustomerMicroGoalController,
  ],
})
export class CustomerMicroGoalModule {}
