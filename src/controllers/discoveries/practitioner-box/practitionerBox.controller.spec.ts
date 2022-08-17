import { Test, TestingModule } from '@nestjs/testing';

import { CreatePractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { GetRecurringPractitionerBoxUsecase } from '@Usecases/practitionerBox/getRecurringPractitionerBox.usecase';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerBoxController } from './practitionerBox.controller';
import { ReturnValueType } from '@Filters/customError';

describe('PractitionerBoxController', () => {
  let controller: PractitionerBoxController;

  const mockBox: PractitionerAndBox = {
    box: undefined,
    email: '',
    firstName: '',
    id: 1,
    message: '',
    middleName: '',
    uuid: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerBoxController],
      providers: [
        {
          provide: 'GetPractitionerBoxByUuidUsecaseInterface',
          useValue: {
            getPractitionerBoxByUuid: () =>
              Promise.resolve<ReturnValueType<PractitionerAndBox>>([mockBox]),
          } as GetPractitionerBoxByUuidUsecaseInterface,
        },
        {
          provide: 'CreatePractitionerBoxUsecaseInterface',
          useValue: {
            createPractitionerBox: () =>
              Promise.resolve<ReturnValueType<PractitionerAndBox>>([mockBox]),
          } as CreatePractitionerBoxUsecaseInterface,
        },
        {
          provide: 'GetPractitionerBoxByLabelUsecaseInterface',
          useValue: {
            getPractitionerBoxByLabel: () =>
              Promise.resolve<ReturnValueType<PractitionerAndBox>>([mockBox]),
          } as GetPractitionerBoxByLabelUsecaseInterface,
        },
        {
          provide: 'GetRecurringPractitionerBoxUsecaseInterface',
          useClass: GetRecurringPractitionerBoxUsecase,
        },
      ],
    }).compile();

    controller = module.get<PractitionerBoxController>(
      PractitionerBoxController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
