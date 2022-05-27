import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { execFile, spawn } from 'child_process';
import { ShipheroAuthRepoInterface } from '../../repositories/shiphero/shipheroAuth.repository';

export interface UpdateShipheoKeyUsecaseInterface {
  updateShipheroKey(): Promise<[string?, Error?]>;
}

@Injectable()
export class UpdateShipheoKeyUsecase
  implements UpdateShipheoKeyUsecaseInterface
{
  constructor(
    @Inject('ShipheroAuthRepoInterface')
    private readonly shipheroAuthRepo: ShipheroAuthRepoInterface,
  ) {}

  async updateShipheroKey(): Promise<[string?, Error?]> {
    const [newToken, getNewTokenError] =
      await this.shipheroAuthRepo.getNewToken();
    if (getNewTokenError) {
      return [undefined, getNewTokenError];
    }

    const child = spawn('gcloud', [
      'run',
      'deploy',
      process.env.GCP_PROJECT,
      '--image',
      process.env.GCP_IMAGE,
      '--region',
      process.env.GCP_REGION,
      '--update-env-vars',
      `TEST=\Bearer ${newToken}`,
    ]);
    return ['OK'];
  }
}
