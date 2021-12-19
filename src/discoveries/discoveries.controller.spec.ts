import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveriesController } from './discoveries.controller';

describe('DiscoveriesController', () => {
  let controller: DiscoveriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveriesController],
    }).compile();

    controller = module.get<DiscoveriesController>(DiscoveriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
