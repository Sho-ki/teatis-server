import { SurveyQuestionResponse } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '../../src/domains/ProductSurveyQuestionResponse';
import { SurveyQuestionResponsesWithOptions } from '../../src/domains/SurveyQuestionResponse';
import { ReturnValueType } from '../../src/filter/customError';
import { CustomerSurveyResponseRepositoryInterface } from '../../src/repositories/teatisDB/customer/customerSurveyResponse.repository';

interface MockCustomerSurveyResponseRepositoryParams {
  upsertCustomerResponse?: Partial<SurveyQuestionResponse>;
  upsertCustomerResponseWithProduct?: Partial<SurveyQuestionResponse>;
  getCustomerSurveyAllProductsResponses?: Partial<ProductSurveyQuestionResponse>[];
  getCustomerSurveyOneProductResponses?: Partial<ProductSurveyQuestionResponse>[];
  getCustomerSurveyResponses?: Partial<SurveyQuestionResponsesWithOptions>[];
  getCustomerSurveyQuestionResponse?: Partial<SurveyQuestionResponsesWithOptions>;
}

export const mockCustomerSurveyResponseRepository = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: MockCustomerSurveyResponseRepositoryParams = {}
): Partial<CustomerSurveyResponseRepositoryInterface> => {
  return {
    // upsertCustomerResponse: jest
    //   .fn<Promise<SurveyQuestionResponse>, [UpsertCustomerResponseArgs]>()
    //   .mockResolvedValue({ ...params.upsertCustomerResponse }),

    // upsertCustomerResponseWithProduct: jest
    //   .fn<Promise<SurveyQuestionResponse>, [UpsertCustomerResponseWithProductsArgs]>()
    //   .mockResolvedValue({ ...params.upsertCustomerResponseWithProduct }),

    // getCustomerSurveyAllProductsResponses: jest
    //   .fn<Promise<ProductSurveyQuestionResponse[]>, [GetCustomerProductSurveyResponseArgs]>()
    //   .mockResolvedValue([...(params.getCustomerSurveyAllProductsResponses || [])]),

    // getCustomerSurveyOneProductResponses: jest
    //   .fn<Promise<ProductSurveyQuestionResponse[]>, [GetCustomerSurveyOneProductResponsesArgs]>()
    //   .mockResolvedValue([...(params.getCustomerSurveyOneProductResponses || [])]),

    getCustomerSurveyResponses: jest
      .fn<Promise<ReturnValueType<SurveyQuestionResponsesWithOptions[]>>, []>()
      .mockResolvedValue( [
        [
          {
            surveyQuestion: {
              id: 1,
              name: 'exampleQuestion',
              label: 'Example question label',
              isRequired: true,
              isCustomerFeature: false,
              hint: 'Example hint',
              placeholder: 'Example placeholder',
              responseType: 'text',
              parentSurveyQuestionId: null,
              createdAt: new Date('2023-05-08T00:00:00Z'),
              updatedAt: new Date('2023-05-08T00:00:00Z'),
              surveyQuestionOptions: [
                {
                  id: 1,
                  label: 'Option 1',
                  value: 10,
                  surveyQuestionId: 1,
                  isArchived: false,
                  createdAt: new Date('2023-05-08T00:00:00Z'),
                  updatedAt: new Date('2023-05-08T00:00:00Z'),
                },
                {
                  id: 2,
                  label: 'Option 2',
                  value: 20,
                  surveyQuestionId: 1,
                  isArchived: false,
                  createdAt: new Date('2023-05-08T00:00:00Z'),
                  updatedAt: new Date('2023-05-08T00:00:00Z'),
                },
              ],
            },
            id: 1,
            surveyQuestionId: 1,
            customerSurveyHistoryId: 1,
            response: JSON.stringify(1),
            createdAt: new Date('2023-05-08T00:00:00Z'),
            updatedAt: new Date('2023-05-08T00:00:00Z'),
          },
        ],
      ]),

    getCustomerSurveyQuestionResponse: jest
      .fn<Promise<ReturnValueType<SurveyQuestionResponsesWithOptions>>, []>()
      .mockResolvedValue([
        {
          surveyQuestion: {
            id: 1,
            name: 'exampleQuestion',
            label: 'Example question label',
            isRequired: true,
            isCustomerFeature: false,
            hint: 'Example hint',
            placeholder: 'Example placeholder',
            responseType: 'text',
            parentSurveyQuestionId: null,
            createdAt: new Date('2023-05-08T00:00:00Z'),
            updatedAt: new Date('2023-05-08T00:00:00Z'),
            surveyQuestionOptions: [
              {
                id: 1,
                label: 'Option 1',
                value: 10,
                surveyQuestionId: 1,
                isArchived: false,
                createdAt: new Date('2023-05-08T00:00:00Z'),
                updatedAt: new Date('2023-05-08T00:00:00Z'),
              },
              {
                id: 2,
                label: 'Option 2',
                value: 20,
                surveyQuestionId: 1,
                isArchived: false,
                createdAt: new Date('2023-05-08T00:00:00Z'),
                updatedAt: new Date('2023-05-08T00:00:00Z'),
              },
            ],
          },
          id: 1,
          surveyQuestionId: 1,
          customerSurveyHistoryId: 1,
          response: JSON.stringify(1),
          createdAt: new Date('2023-05-08T00:00:00Z'),
          updatedAt: new Date('2023-05-08T00:00:00Z'),
        },
      ]),

    setPrismaClient: jest.fn(),
    setDefaultPrismaClient: jest.fn(),
  };
};
