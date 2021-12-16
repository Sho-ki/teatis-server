import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  CustomerAllRes,
  CustomerResFields,
  CustomerResponse,
} from 'src/types/customerResponse';

interface TypeFromRepositoryIntreface {
  getCustomerResponses(customerResponseId: string): Promise<CustomerResponse>;
}

@Injectable()
export class TypeFormRepostitory implements TypeFromRepositoryIntreface {
  async getCustomerResponses(
    customerResponseId: string,
  ): Promise<CustomerResponse> {
    try {
      const typeformId = 'NoAh1OoI';
      const TYPEFORM_URL = `https://api.typeform.com/forms/${typeformId}/responses?query=${customerResponseId}`;

      const { answers: customerResFields } = await axios
        .get<CustomerAllRes>(TYPEFORM_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.TYPEFORM_AUTH,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          return res.data.items[0];
        });

      let QACombination: CustomerResponse =
        this.createQACombination(customerResFields);
      return QACombination;
    } catch (e) {
      throw new Error('Something went wrong');
    }
  }

  createQACombination(
    customerResFields: CustomerResFields[],
  ): CustomerResponse {
    let QASetObj = {} as CustomerResponse;

    customerResFields.map((customerResAnswer: CustomerResFields) => {
      switch (customerResAnswer.field.ref) {
        case 'diabetes':
          return (QASetObj['diabetes'] = customerResAnswer.choice.ref);
        case 'gender':
          return (QASetObj['gender'] = customerResAnswer.choice.ref);
        case 'height':
          return (QASetObj['height'] = customerResAnswer.number);
        case 'weight':
          return (QASetObj['weight'] = customerResAnswer.number);
        case 'age':
          return (QASetObj['age'] = customerResAnswer.number);
        case 'medicalConditions':
          return (QASetObj['medicalConditions'] = customerResAnswer.choice.ref);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] =
            customerResAnswer.choices.refs);
        case 'activeLevel':
          return (QASetObj['activeLevel'] = customerResAnswer.choice.ref);
        case 'a1cScore':
          return (QASetObj['a1cScore'] = customerResAnswer.choice.ref);
        case 'a1cScoreGoal':
          return (QASetObj['a1cScoreGoal'] = customerResAnswer.choice.ref);
        case 'allergies':
          return (QASetObj['allergies'] = customerResAnswer.text);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] =
            customerResAnswer.choices.refs);
        case 'sweetOrSavory':
          return (QASetObj['sweetOrSavory'] = customerResAnswer.choice.ref);
        case 'foodPalate':
          return (QASetObj['foodPalate'] = customerResAnswer.number);
        case 'email':
          return (QASetObj['email'] = customerResAnswer.email);
        default:
          break;
      }
    });
    return QASetObj;
  }
}
