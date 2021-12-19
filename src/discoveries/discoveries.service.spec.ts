import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveriesService } from './discoveries.service';

describe('DiscoveryService', () => {
  let service: DiscoveriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscoveriesService],
    }).compile();

    service = module.get<DiscoveriesService>(DiscoveriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
