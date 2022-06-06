import { Inject, Injectable } from '@nestjs/common';
import { ShipheroAuthRepoInterface } from '@Repositories/shiphero/shipheroAuth.repository';
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
    try {
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
    } catch (e) {
      return [
        undefined,
        { name: 'faliled', message: 'updateShipheroKey Failed' },
      ];
    }
  }
}