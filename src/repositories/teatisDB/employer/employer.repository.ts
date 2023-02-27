import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Employer } from '@prisma/client';

export interface GetEmployerByUuidArgs {
  uuid: string;
}

export interface EmployerRepositoryInterface {
  getEmployerByUuid({ uuid }: GetEmployerByUuidArgs):
  Promise<ReturnValueType<Employer>>;

}

@Injectable()
export class EmployerRepository implements EmployerRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async getEmployerByUuid({ uuid }: GetEmployerByUuidArgs):
  Promise<ReturnValueType<Employer>> {
    const response = await this.prisma.employer.findUnique({ where: { uuid } });
    if(!response){
      return [undefined, { name: 'NotFound', message: 'Employer not found' }];
    }
    return [response];
  }

}
