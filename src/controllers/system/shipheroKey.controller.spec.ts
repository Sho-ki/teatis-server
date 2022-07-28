import { Test, TestingModule } from '@nestjs/testing';
import { ShipheroKeyController } from './shipheroKey.controller';
import {UpdateShipheoKeyUsecaseInterface} from "@Usecases/shipheroKey/updateShipheroKey.usecase";
import { Status } from '@Domains/Status';

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
              Promise.resolve<[Status?, Error?]>([
                {success:true},
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
