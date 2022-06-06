import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerBoxController } from './practitionerBox.controller';

describe('PractitionerBoxController', () => {
  let controller: PractitionerBoxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerBoxController],
    }).compile();

    controller = module.get<PractitionerBoxController>(
      PractitionerBoxController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
