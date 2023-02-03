import {  ActiveSurvey } from './Survey';

export interface PostPurchaseSurveyWithResponse extends ActiveSurvey {
  redirectEndpoint:string;
  historyId: number;
}

