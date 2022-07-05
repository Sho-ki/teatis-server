import { Test, TestingModule } from '@nestjs/testing';
import { ShipheroKeyController } from './shipheroKey.controller';
import {UpdateShipheoKeyUsecaseInterface} from "@Usecases/shipheroKey/updateShipheroKey.usecase";

describe('ShipheroKeyController', () => {
  let controller: ShipheroKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipheroKeyController],
      providers: [
        {
          provide: 'UpdateShipheoKeyUsecaseInterface',
          useValue: {
            updateShipheroKey: () =>
              Promise.resolve<[string?, Error?]>([
                "Some string returned by ShipHero",
              ]),
          } as UpdateShipheoKeyUsecaseInterface
        },
      ]
    }).compile();

    controller = module.get<ShipheroKeyController>(ShipheroKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
