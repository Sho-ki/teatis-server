import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KlaviyoRepository } from './klaviyo.reposity';
require('dotenv').config();

describe('Klaviyo test', () => {
    let app: INestApplication;
    let klaviyoRepository: KlaviyoRepository;
    beforeAll(async () => {
        const moduleRef =
          await Test.createTestingModule({
            imports: [KlaviyoRepository],
          }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        await app.listen(3333);
    
        klaviyoRepository = app.get(KlaviyoRepository);
    })
    afterAll(() => {
        app.close();
    });
    describe('post user info to klaviyo', () => {
        it('should get current user', async () => {
            const error = await klaviyoRepository.postUserInfo("jestEmail@test.com", "9f90c1c1-7481-4d4f-a6af-2d06515eb3f8", "HC")
            expect(error).toBeNull();
        });
    });
});
