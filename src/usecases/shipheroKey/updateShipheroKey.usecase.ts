import { Inject, Injectable } from '@nestjs/common';
import { ShipheroAuthRepositoryInterface } from '@Repositories/shiphero/shipheroAuth.repository';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '../../filter/customError';

export interface UpdateShipheoKeyUsecaseInterface {
  updateShipheroKey(): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class UpdateShipheoKeyUsecase
  implements UpdateShipheoKeyUsecaseInterface
{
  constructor(
    @Inject('ShipheroAuthRepositoryInterface')
    private readonly shipheroAuthRepository: ShipheroAuthRepositoryInterface,
  ) {}

  async updateShipheroKey(): Promise<ReturnValueType<Status>> {
    const [newToken, getNewTokenError] =
      await this.shipheroAuthRepository.getNewToken();
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

    return [{success:true}];
  }
}
