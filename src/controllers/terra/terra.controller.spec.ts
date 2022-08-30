import { Test, TestingModule } from '@nestjs/testing';
import { TerraController } from './terra.controller';

describe('TerraController', () => {
  let controller: TerraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [TerraController] }).compile();

    controller = module.get<TerraController>(TerraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
