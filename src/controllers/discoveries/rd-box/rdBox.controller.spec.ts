import { Test, TestingModule } from '@nestjs/testing';
import { RdBoxController } from './rdBox.controller';

describe('RdBoxController', () => {
  let controller: RdBoxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RdBoxController],
    }).compile();

    controller = module.get<RdBoxController>(RdBoxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
