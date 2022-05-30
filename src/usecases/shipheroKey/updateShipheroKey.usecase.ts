import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ShipheroAuthRepoInterface } from '../../repositories/shiphero/shipheroAuth.repository';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

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

    // Instantiates a client
    const client = new SecretManagerServiceClient();
    const parent = 'projects/441786500914/secrets/shiphero_key';

    const [version] = await client.addSecretVersion({
      parent: parent,
      payload: {
        data: Buffer.from(`Bearer ${newToken}`, 'utf8'),
      },
    });
    console.info(`Added secret version ${version.name}`);

    return ['OK'];
  }
}
