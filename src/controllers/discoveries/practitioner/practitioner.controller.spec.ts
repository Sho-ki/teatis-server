import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerController } from './practitioner.controller';
import {GetPractitionerUsecaseInterface} from "@Usecases/practitioner/getPractitioner.usecase";
import {Practitioner} from "@Domains/Practitioner";
import {CreatePractitionerUsecaseInterface} from "@Usecases/practitioner/createPractitioner.usecase";
import { ReturnValueType } from '../../../filter/customError';

describe('PractitionerController', () => {
  let controller: PractitionerController;

  let mockPractitioner: Practitioner = {
    id: 1,
    email: "",
    firstName: "",
    message: "",
    middleName: "",
    uuid: ""
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerController],
      providers: [
        {
          provide: 'CreatePractitionerUsecaseInterface',
          useValue: {
            createPractitioner: () =>
              Promise.resolve<ReturnValueType<Practitioner>>([
                mockPractitioner
              ]),
          } as CreatePractitionerUsecaseInterface
        },
        {
          provide: 'GetPractitionerUsecaseInterface',
          useValue: {
            getPractitioner: () =>
              Promise.resolve<ReturnValueType<Practitioner>>([
                mockPractitioner
              ]),
          } as GetPractitionerUsecaseInterface
        },
      ]
    }).compile();

    controller = module.get<PractitionerController>(PractitionerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
