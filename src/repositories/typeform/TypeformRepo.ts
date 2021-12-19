import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  DiscoveryAllRes,
  DiscoveryResFields,
  DiscoveryResponse,
} from 'src/types/discoveryResponse';

interface TypeFromRepositoryIntreface {
  getDiscoveryResponses(
    discoveryResponseId: string,
  ): Promise<DiscoveryResponse>;
}

@Injectable()
export class TypeFormRepostitory implements TypeFromRepositoryIntreface {
  async getDiscoveryResponses(
    discoveryResponseId: string,
  ): Promise<DiscoveryResponse> {
    try {
      const typeformUrlId = process.env.TYPEFORM_URL_ID;
      const TYPEFORM_URL = `https://api.typeform.com/forms/${typeformUrlId}/responses?query=${discoveryResponseId}`;

      const { answers: discoveryResFields } = await axios
        .get<DiscoveryAllRes>(TYPEFORM_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.TYPEFORM_AUTH,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          return res.data.items[0];
        });

      let QACombination: DiscoveryResponse =
        this.createQACombination(discoveryResFields);
      return QACombination;
    } catch (e) {
      throw new Error('Something went wrong');
    }
  }

  createQACombination(
    discoveryResFields: DiscoveryResFields[],
  ): DiscoveryResponse {
    let QASetObj = {} as DiscoveryResponse;

    discoveryResFields.map((discoveryResAnswer: DiscoveryResFields) => {
      switch (discoveryResAnswer.field.ref) {
        case 'diabetes':
          return (QASetObj['diabetes'] = discoveryResAnswer.choice.ref);
        case 'gender':
          return (QASetObj['gender'] = discoveryResAnswer.choice.ref);
        case 'height':
          return (QASetObj['height'] = discoveryResAnswer.number);
        case 'weight':
          return (QASetObj['weight'] = discoveryResAnswer.number);
        case 'age':
          return (QASetObj['age'] = discoveryResAnswer.number);
        case 'medicalConditions':
          return (QASetObj['medicalConditions'] =
            discoveryResAnswer.choice.ref);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] =
            discoveryResAnswer.choices.refs);
        case 'activeLevel':
          return (QASetObj['activeLevel'] = discoveryResAnswer.choice.ref);
        case 'a1cScore':
          return (QASetObj['a1cScore'] = discoveryResAnswer.choice.ref);
        case 'a1cScoreGoal':
          return (QASetObj['a1cScoreGoal'] = discoveryResAnswer.choice.ref);
        case 'allergies':
          return (QASetObj['allergies'] = discoveryResAnswer.text);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] =
            discoveryResAnswer.choices.refs);
        case 'sweetOrSavory':
          return (QASetObj['sweetOrSavory'] = discoveryResAnswer.choice.ref);
        case 'foodPalate':
          return (QASetObj['foodPalate'] = discoveryResAnswer.number);
        case 'email':
          return (QASetObj['email'] = discoveryResAnswer.email);
        default:
          break;
      }
    });
    return QASetObj;
  }
}
