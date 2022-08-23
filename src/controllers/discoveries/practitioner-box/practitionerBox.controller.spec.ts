import { Test, TestingModule } from '@nestjs/testing';

import { CreatePractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetAllPractitionerBoxesUsecaseInterface } from '@Usecases/practitionerBox/getAllPractitionerBoxes.usecase';
import { GetAllProductsUsecaseInterface } from '@Usecases/product/getAllProducts.usecase';
import { GetPractitionerBoxByLabelUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecaseInterface } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { GetRecurringPractitionerBoxUsecaseInterface } from '@Usecases/practitionerBox/getRecurringPractitionerBox.usecase';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerBox } from '@Domains/PractitionerBox';
import { PractitionerBoxController } from './practitionerBox.controller';
import { Product } from '@Domains/Product';
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
  const mockBoxProduct: Product[] = [
    {
      id: 1,
      name: '',
      label: '',
      sku: '',
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
          provide: 'GetAllPractitionerBoxesUsecaseInterface',
          useValue: {
            getAllPractitionerBoxes: () =>
              Promise.resolve<ReturnValueType<PractitionerBox[]>>([mockBoxPractitionerBox]),
          } as GetAllPractitionerBoxesUsecaseInterface,
        },
        {
          provide: 'UpdateRecurringPractitionerBoxesUsecaseInterface',
          useValue: {
            filterDuplicatePractitionerBox: () =>
              Promise.resolve<ReturnValueType<PractitionerBox[]>>([mockBoxPractitionerBox]),
            swapTargetProducts: () =>
              Promise.resolve<ReturnValueType<PractitionerBox[]>>([mockBoxPractitionerBox]),
            updateRecurringPractitionerBoxes: () =>
              Promise.resolve<ReturnValueType<PractitionerBox[]>>([mockBoxPractitionerBox]),
          } as UpdateRecurringPractitionerBoxesUsecaseInterface,
        },
        {
          provide: 'GetAllProductsUsecaseInterface',
          useValue: {
            getAllProducts: () =>
              Promise.resolve<ReturnValueType<Product[]>>([mockBoxProduct]),
          } as GetAllProductsUsecaseInterface,
        },
        {
          provide: 'GetRecurringPractitionerBoxUsecaseInterface',
          useValue: {
            getRecurringPractitionerBox: () =>
              Promise.resolve<unknown>([mockBox]),
          } as GetRecurringPractitionerBoxUsecaseInterface,
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
