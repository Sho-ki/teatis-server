import { Test, TestingModule } from '@nestjs/testing';
import { Url } from '../../domains/Url';
import { ReturnValueType } from '../../filter/customError';
import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
import { TerraController } from './terra.controller';

describe('TerraController', () => {
  let controller: TerraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerraController],
      providers: [
        {
          provide: 'GetTerraAuthUrlUsecaseInterface',
          useValue: {
            getTerraAuthUrl: () =>
              Promise.resolve<ReturnValueType<Url>>([{ url: 'teatismeal.com' }]),
          } as GetTerraAuthUrlUsecaseInterface,
        },
      ],
    }).compile();

    controller = module.get<TerraController>(TerraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
