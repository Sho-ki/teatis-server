import { Test, TestingModule } from '@nestjs/testing';
import { SurveyQuestionResponse } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '../../domains/ProductSurveyQuestionResponse';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { PostPostPurchaseSurveyUsecase } from './postPostPurchaseSurvey.usecase';

describe('PostPostPurchaseSurveyUsecase', () => {
  let usecase: PostPostPurchaseSurveyUsecase;
  let MockedCustomerSurveyResponse: Partial<CustomerSurveyResponseRepositoryInterface>;

  beforeEach(async () => {
    MockedCustomerSurveyResponse= {
      getCustomerSurveyOneProductResponses: jest.fn<Promise<ProductSurveyQuestionResponse[]>, []>().mockResolvedValue( [
        {
          id: 10,
          surveyQuestionId: 3,
          customerSurveyHistoryId: 4,
          response: 'I like it',
          createdAt: new Date('2023-02-06'),
          updatedAt: new Date('2023-02-06'),
          product: {
            id: 2413,
            label: 'Think Jerky: Jerky, Sesame Teriyaki',
            name: 'Think Jerky: Jerky, Sesame Teriyaki',
            sku: 'x10410-JRK-SN20158',
          },
        },
      ]),
      upsertCustomerResponseWithProduct: jest.fn<Promise<SurveyQuestionResponse>, []>().mockResolvedValue(
        {
          id: 1,
          surveyQuestionId: 789,
          customerSurveyHistoryId: 123,
          response: 100,
          createdAt: new Date('2023-02-06'),
          updatedAt: new Date('2023-02-06'),
        },
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostPostPurchaseSurveyUsecase,
        {
          provide: 'CustomerSurveyResponseRepositoryInterface',
          useValue: MockedCustomerSurveyResponse,
        },

      ],
    }).compile();

    usecase = module.get<PostPostPurchaseSurveyUsecase>(PostPostPurchaseSurveyUsecase);

  });

  it('should call upsertCustomerResponseWithProduct for each customer response', async () => {
    const historyId = 123;
    const customerResponses = [
      {
        productId: 456,
        surveyQuestionId: 789,
        response: 'Some response',
      },

    ];
    const result = await usecase.postPostPurchaseSurvey({ historyId, customerResponses });
    expect(result[0][0]).toMatchObject({
      id: 1,
      surveyQuestionId: 789,
      customerSurveyHistoryId: 123,
      response: 100,
      createdAt: new Date('2023-02-06'),
      updatedAt: new Date('2023-02-06'),
    });

  });

});

