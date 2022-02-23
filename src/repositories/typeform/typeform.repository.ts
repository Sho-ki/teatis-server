import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface GetCustomerAnsArgs {
  typeformId: string;
}

export interface GetCustomerAnsRes {
  field: {
    id: string;
    ref: string;
    type: string;
  };
  type: string;
  number?: number;
  choice?: { id: string; label: string; ref: string };
  choices?: { ids: string[]; labels: string[]; refs: string[] };
  text?: string;
  email?: string;
}

interface TypeformGetCustomerAnsRes {
  total_items: number;
  page_count: number;
  items: [
    {
      landing_id: string;
      token: string;
      response_id: string;
      landed_at: string;
      submitted_at: string;
      metadata: {
        user_agent: string;
        platform: string;
        referer: string;
        network_id: string;
        browser: string;
      };
      hidden: {
        typeformid: string;
      };
      answers: TypeformGetCustomerAnsField[];
    },
  ];
}

interface TypeformGetCustomerAnsField {
  field: {
    id: string;
    ref: string;
    type: string;
  };
  type: string;
  number?: number;
  choice?: { id: string; label: string; ref: string };
  choices?: { ids: string[]; labels: string[]; refs: string[] };
  text?: string;
  email?: string;
}

export interface TypeformRepoInterface {
  getCustomerResponse({
    typeformId,
  }: GetCustomerAnsArgs): Promise<GetCustomerAnsRes[]>;
}

@Injectable()
export class TypeformRepo implements TypeformRepoInterface {
  async getCustomerResponse({
    typeformId,
  }: GetCustomerAnsArgs): Promise<GetCustomerAnsRes[]> {
    const typeformUrlId = process.env.TYPEFORM_URL_ID;
    const TYPEFORM_URL = `https://api.typeform.com/forms/${typeformUrlId}/responses?query=${typeformId}`;

    const typeformResponse = await axios
      .get<TypeformGetCustomerAnsRes>(TYPEFORM_URL, {
        headers: {
          Authorization: process.env.TYPEFORM_AUTH,
        },
      })
      .then((res) => {
        const matchedItem = res.data.items.find((item) => {
          return item.hidden.typeformid === typeformId;
        });

        return matchedItem;
      })
      .catch(() => {
        throw new Error('Something went wrong');
      });
    return typeformResponse.answers;
  }
}
