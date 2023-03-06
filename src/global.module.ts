import { Global, Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AnalyzePreferenceRepository } from '@Repositories/dataAnalyze/dataAnalyze.respository';
import { GoogleCalendarRepository } from '@Repositories/googleOAuth2/googleCalendar.repository';
import { GoogleOAuth2Repository } from '@Repositories/googleOAuth2/googleOAuth2.repository';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { ShipheroAuthRepository } from '@Repositories/shiphero/shipheroAuth.repository';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { CoachRepository } from '@Repositories/teatisDB/coach/coach.repository';
import { CustomerAuthRepository } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerPreferenceRepository } from '@Repositories/teatisDB/customer/customerPreference.repository';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { CustomerSurveyResponseRepository } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepository } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { CustomerEventLogRepository } from '@Repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { EmployeeRepository } from '@Repositories/teatisDB/employee/employee.repository';
import { EmployerRepository } from '@Repositories/teatisDB/employer/employer.repository';
import { MasterMonthlyBoxRepository } from '@Repositories/teatisDB/masterMonthlyBox/masterMonthlyBox.repository';
import { MonthlySelectionRepository } from '@Repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repository';
import { PractitionerGeneralRepository } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { SurveyQuestionsRepository } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { TemporaryPrePurchaseSurveyRepository } from '@Repositories/teatisDB/temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.repository';
import { TerraCustomerRepository } from '@Repositories/teatisDB/terraCustomer/terraCustomer.repository';
import { TerraRepository } from '@Repositories/terra/terra.repository';
import { PurchaseDateBasedMessageRepository } from './repositories/teatisDB/autoMessage/purchaseDateBasedMessage.repository';
import { SequentBasedMessageRepository } from './repositories/teatisDB/autoMessage/sequesntBasedMessage.repository';

const createGlobalModule = (repositories, configurations) => {
  const globalModule: ModuleMetadata = { providers: [], exports: [] };

  for(const configuration of configurations) {
    globalModule.providers.push(configuration);
    globalModule.exports.push(configuration);
  }
  for(const repository of repositories) {
    globalModule.providers.push(repository);
    globalModule.providers.push({
      provide: `${repository.name}Interface`,
      useExisting: repository,
    });
    globalModule.exports.push(`${repository.name}Interface`);
  }
  return globalModule;
};

@Global()
@Module(createGlobalModule([
  CustomerGeneralRepository,
  EmployeeRepository,
  ProductGeneralRepository,
  TerraRepository,
  KlaviyoRepository,
  MonthlySelectionRepository,
  ShipheroRepository,
  SurveyQuestionsRepository,
  CustomerSurveyResponseRepository,
  CustomerSurveyHistoryRepository,
  PractitionerGeneralRepository,
  CustomerSessionRepository,
  PractitionerBoxRepository,
  MasterMonthlyBoxRepository,
  EmployerRepository,
  CoachRepository,
  TemporaryPrePurchaseSurveyRepository,
  AnalyzePreferenceRepository,
  ShopifyRepository,
  CustomerPreferenceRepository,
  CustomerEventLogRepository,
  GoogleCalendarRepository,
  GoogleOAuth2Repository,
  CustomerAuthRepository,
  TerraCustomerRepository,
  ShipheroAuthRepository,
  PurchaseDateBasedMessageRepository,
  SequentBasedMessageRepository,
], [PrismaService]))
export class GlobalModule {}
