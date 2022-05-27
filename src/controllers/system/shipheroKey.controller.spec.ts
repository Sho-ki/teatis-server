import { Test, TestingModule } from '@nestjs/testing';
import { ShipheroKeyController } from './shipheroKey.controller';

describe('ShipheroKeyController', () => {
  let controller: ShipheroKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipheroKeyController],
    }).compile();

    controller = module.get<ShipheroKeyController>(ShipheroKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
