import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KlaviyoRepository } from './klaviyo.repository';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

describe('Klaviyo test', () => {
  let app: INestApplication;
  let klaviyoRepository: KlaviyoRepository;
  beforeAll(async () => {
    const moduleRef =
          await Test.createTestingModule({ imports: [KlaviyoRepository] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(3333);

    klaviyoRepository = app.get(KlaviyoRepository);
  });
  afterAll(() => {
    app.close();
  });
  const email = 'jestEmail@test.com';
  const customerUuid = '9f90c1c1-7481-4d4f-a6af-2d06515eb3f8';
  const serverSideUrl = `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_POTENTIAL_CUSTOMER_LIST}/members?api_key=${process.env.KLAVIYO_API}`;

  describe('post user information to klaviyo', () => {
    it('should update the klaviyo list successfully', async () => {
      const [, error] =
             await klaviyoRepository.postCustomerInformation({ email, customerUuid, serverSideUrl });
      expect(error).toBeNull();
    });
  });
  describe('delete user information from klaviyo', () => {
    it('should update the klaviyo list successfully', async () => {
      const [, error] = await klaviyoRepository.deleteUserInformation({ email, serverSideUrl });
      expect(error).toBeNull();
    });
  });
});
