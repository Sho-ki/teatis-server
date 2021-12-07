import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
require('dotenv').config();

import { CreateUserInfoDto } from './dtos/create-user.dto';
import { QASet } from 'src/types/IDSets';
import { Repository } from 'typeorm';
import { UserResponse } from 'src/types/UserResponse';
import { Users } from './users.entity';
import { calculateBMR } from './steps/step1';
import { calculateMacronutrients } from './steps/step2';
import { calculatePerMeal } from './steps/step3';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async createUser(body: CreateUserInfoDto) {
    const typeformResponse = await this.findUserInTypeForm(body.typeformUserId);

    // Step 1: Calculate calorie needs
    const BMR = calculateBMR(
      typeformResponse['gender'],
      typeformResponse['age'],
      typeformResponse['height'],
      typeformResponse['weight'],
    );

    // Step 2: Calculate individual macronutrients
    const { carbsMacronutrients, proteinMacronutrients, fatMacronutrients } =
      calculateMacronutrients(BMR, typeformResponse['activeLevel']);

    // Step 3: custom meal plan based on recommendations
    const { carbsPerMeal, proteinPerMeal, fatPerMeal, caloriePerMeal } =
      calculatePerMeal(
        carbsMacronutrients,
        proteinMacronutrients,
        fatMacronutrients,
        BMR,
      );
  }

  async findUserInTypeForm(typeformUserId: string) {
    const typeformId = 'NoAh1OoI';
    const TYPEFORM_URL = `https://api.typeform.com/forms/${typeformId}/responses?query=${typeformUserId}`;

    const responses = await axios(TYPEFORM_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.TYPEFORM_AUTH,
        Accept: 'application/json',
      },
    });

    const userResponses = responses.data.items[0].answers;
    const QACombination = createQACombination(userResponses);

    return QACombination;
  }
}

function createQACombination(userResponses: UserResponse[]) {
  let QASetObj = {};
  userResponses.map((userResponse: UserResponse) => {
    switch (userResponse.field.id) {
      case 'DqnQZLFI07XA':
        return (QASetObj[QASet.DqnQZLFI07XA] = userResponse.choice.label);
      case 'RO9hYJDJSY5d':
        return (QASetObj[QASet.RO9hYJDJSY5d] = userResponse.choice.label);
      case 'y811Ht4wFlk7':
        return (QASetObj[QASet.y811Ht4wFlk7] = userResponse.number);
      case 'ZomxIwhTwiDI':
        return (QASetObj[QASet.ZomxIwhTwiDI] = userResponse.number);
      case '2ouLLBfpcPu8':
        return (QASetObj[QASet['2ouLLBfpcPu8']] = userResponse.number);
      case 'OY5ahhiimeHj':
        return (QASetObj[QASet.OY5ahhiimeHj] = userResponse.choice.label);
      case 'OuGVT3I0ogEV':
        return (QASetObj[QASet.OuGVT3I0ogEV] = userResponse.choice.label);
      case '2smbBBo0VRdm':
        return (QASetObj[QASet['2smbBBo0VRdm']] = userResponse.choice.label);
      case 'MwDtebdxjPy0':
        return (QASetObj[QASet.MwDtebdxjPy0] = userResponse.choice.label);
      case 'AJurjbRyf59j':
        return (QASetObj[QASet.AJurjbRyf59j] = userResponse.text);
      case 'UeMcjfF8WezG':
        return (QASetObj[QASet.UeMcjfF8WezG] = userResponse.choices.labels);
      case 'd6r3b8vnxZuP':
        return (QASetObj[QASet.d6r3b8vnxZuP] = userResponse.choice.label);
      case 'fgm7wSkH8AxF':
        return (QASetObj[QASet.fgm7wSkH8AxF] = userResponse.number);
      case 'AO2jXYZYNuqI':
        return (QASetObj[QASet.AO2jXYZYNuqI] = userResponse.email);
      default:
        break;
    }
  });
  return QASetObj;
}
