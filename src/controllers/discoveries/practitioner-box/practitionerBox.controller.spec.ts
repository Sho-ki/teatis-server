import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerBoxController } from './practitionerBox.controller';
import {GetPractitionerBoxByUuidUsecaseInterface} from "@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase";
import {CreatePractitionerBoxUsecaseInterface} from "@Usecases/practitionerBox/createPractitionerBox.usecase";
import {GetPractitionerBoxByLabelUsecaseInterface} from "@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase";
import {PractitionerSingleBox} from "@Domains/PractitionerSingleBox";

describe('PractitionerBoxController', () => {
  let controller: PractitionerBoxController;

  let mockBox : PractitionerSingleBox = {
    box: undefined,
    email: "",
    firstName: "",
    id: 1,
    message: "",
    middleName: "",
    uuid: ""
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerBoxController],
      providers: [
        {
          provide: 'GetPractitionerBoxByUuidUsecaseInterface',
          useValue: {
            getPractitionerBoxByUuid: () =>
              Promise.resolve<[PractitionerSingleBox?, Error?]>([
                mockBox
              ]),
          } as GetPractitionerBoxByUuidUsecaseInterface
        },
        {
          provide: 'CreatePractitionerBoxUsecaseInterface',
          useValue: {
            createPractitionerBox: () =>
              Promise.resolve<[PractitionerSingleBox?, Error?]>([
                mockBox
              ]),
          } as CreatePractitionerBoxUsecaseInterface
        },
        {
          provide: 'GetPractitionerBoxByLabelUsecaseInterface',
          useValue: {
            getPractitionerBoxByLabel: () =>
              Promise.resolve<[PractitionerSingleBox?, Error?]>([
                mockBox
              ]),
          } as GetPractitionerBoxByLabelUsecaseInterface
        }
      ]
    }).compile();

    controller = module.get<PractitionerBoxController>(
      PractitionerBoxController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
