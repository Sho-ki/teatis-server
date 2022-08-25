import { Test, TestingModule } from '@nestjs/testing';

import { CreatePractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxController } from './practitionerBox.controller';
import { ReturnValueType } from '@Filters/customError';
import { UpdateRecurringPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';

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
  const mockBoxPractitionerBox: PractitionerBox[] = [
    {
      id: 1,
      practitionerId: 1,
      uuid: '',
      label: '',
      description: '',
      note: '',
      products: [],
    },
  ];

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
          provide: 'UpdateRecurringPractitionerBoxesUsecaseInterface',
          useValue: {
            upsertRecurringPractitionerBoxes: () =>
              Promise.resolve<ReturnValueType<PractitionerBox[]>>([mockBoxPractitionerBox]),
          } as UpdateRecurringPractitionerBoxesUsecaseInterface,
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
