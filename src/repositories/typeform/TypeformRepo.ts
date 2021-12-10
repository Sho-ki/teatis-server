import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  UserAllRes,
  UserResFields,
  UserResponse,
} from 'src/types/UserResponse';

export interface TypeFromRepositoryIntreface {
  getUserResponses(userResponseId: string): Promise<UserResponse>;
}

@Injectable()
export class TypeFormRepostitory implements TypeFromRepositoryIntreface {
  async getUserResponses(userResponseId: string): Promise<UserResponse> {
    try {
      const typeformId = 'NoAh1OoI';
      const TYPEFORM_URL = `https://api.typeform.com/forms/${typeformId}/responses?query=${userResponseId}`;
      const { answers: userResFields } = await axios
        .get<UserAllRes>(TYPEFORM_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.TYPEFORM_AUTH,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          return res.data.items[0];
        });
      let QACombination: UserResponse = this.createQACombination(userResFields);
      return QACombination;
    } catch (e) {
      throw new Error('Something went wrong');
    }
  }

  createQACombination(userResFields: UserResFields[]): UserResponse {
    let QASetObj = {} as UserResponse;

    userResFields.map((userResAnswer: UserResFields) => {
      switch (userResAnswer.field.ref) {
        case 'diabetes':
          return (QASetObj['diabetes'] = userResAnswer.choice.ref);
        case 'gender':
          return (QASetObj['gender'] = userResAnswer.choice.ref);
        case 'height':
          return (QASetObj['height'] = userResAnswer.number);
        case 'weight':
          return (QASetObj['weight'] = userResAnswer.number);
        case 'age':
          return (QASetObj['age'] = userResAnswer.number);
        case 'medicalConditions':
          return (QASetObj['medicalConditions'] = userResAnswer.choice.ref);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] = userResAnswer.choices.refs);
        case 'activeLevel':
          return (QASetObj['activeLevel'] = userResAnswer.choice.ref);
        case 'a1cScore':
          return (QASetObj['a1cScore'] = userResAnswer.choice.ref);
        case 'a1cScoreGoal':
          return (QASetObj['a1cScoreGoal'] = userResAnswer.choice.ref);
        case 'allergies':
          return (QASetObj['allergies'] = userResAnswer.text);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] = userResAnswer.choices.refs);
        case 'sweetOrSavory':
          return (QASetObj['sweetOrSavory'] = userResAnswer.choice.ref);
        case 'foodPalate':
          return (QASetObj['foodPalate'] = userResAnswer.number);
        case 'email':
          return (QASetObj['email'] = userResAnswer.email);
        default:
          break;
      }
    });
    return QASetObj;
  }
}
