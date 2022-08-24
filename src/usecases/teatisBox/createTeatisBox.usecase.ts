import { Inject, Injectable } from '@nestjs/common';

import { CreateTeatisBoxDto } from '@Controllers/discoveries/dtos/createTeatisBox';
import { ReturnValueType } from '@Filters/customError';
import { TeatisBox } from '@Domains/TeatisBox';
import { TeatisBoxRepositoryInterface } from '@Repositories/teatisDB/teatis/teatisBox.repository';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { filterDuplicatePractitionerBox } from '@Usecases/utils/getNewestPractitionerBoxes';
import { PractitionerBox } from '@Domains/PractitionerBox';

export interface CreateTeatisBoxUsecaseInterface {
  createTeatisBox({
    products,
    label,
    description,
    note,
  }: CreateTeatisBoxDto): Promise<ReturnValueType<TeatisBox>>;
}

@Injectable()
export class CreateTeatisBoxUsecase
implements CreateTeatisBoxUsecaseInterface
{
  constructor(
    @Inject('TeatisBoxRepositoryInterface')
    private teatisBoxRepository: TeatisBoxRepositoryInterface,
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async createTeatisBox({
    products,
    label,
    description,
    note,
  }: CreateTeatisBoxDto): Promise<ReturnValueType<TeatisBox>> {

    const [teatisBoxProduct, createTeatisBoxProductError] =
      await this.teatisBoxRepository.createTeatisBox({
        label,
        products,
        description,
        note,
      });
    if(createTeatisBoxProductError){ return [undefined, createTeatisBoxProductError]; }

    const [allPractitionerBoxes, allPractitionerBoxesError] =
      await this.practitionerBoxRepository.getAllPractitionerBoxes();
    if (allPractitionerBoxesError) { return [undefined, allPractitionerBoxesError]; }

    const newestRecurringBoxes = filterDuplicatePractitionerBox(allPractitionerBoxes);

    // ごめん、ここ全然わからん。多分ここupertPractitionerAndPractitionerBox使うのが正しいっぽい？
    // const [createRecurringPractitionerBox, createRecurringPractitionerError] =
    // await this.practitionerBoxRepository.performAtomicOperations(
    //   async (): Promise<ReturnValueType<PractitionerBox>> => {
    //     const [response, responseError] = newestRecurringBoxes.map(async newestRecurringBox => {
    //       const { practitionerId, uuid, label, products, description, note } = newestRecurringBox;
    //       const [practitionerBox, practitionerBoxError] = await this.practitionerBoxRepository.createRecurringPractitionerBox({
    //         practitionerId,
    //         practitionerBoxUuid: uuid,
    //         label,
    //         products,
    //         description,
    //         note,
    //       });
    //       if (practitionerBoxError) return [undefined, practitionerBoxError];
    //       return [practitionerBox, undefined];
    //     });
    //     return response;
    //   }
    // );

    return [teatisBoxProduct, undefined];
  }
}
