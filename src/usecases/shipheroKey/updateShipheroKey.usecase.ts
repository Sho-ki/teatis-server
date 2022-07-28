import { Inject, Injectable } from '@nestjs/common';
import { ShipheroAuthRepositoryInterface } from '@Repositories/shiphero/shipheroAuth.repository';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export interface UpdateShipheoKeyUsecaseInterface {
  updateShipheroKey(): Promise<[string?, Error?]>;
}

@Injectable()
export class UpdateShipheoKeyUsecase
implements UpdateShipheoKeyUsecaseInterface
{
  constructor(
    @Inject('ShipheroAuthRepositoryInterface')
    private readonly shipheroAuthRepository: ShipheroAuthRepositoryInterface,
  ) {}

  async updateShipheroKey(): Promise<[string?, Error?]> {
    const [newToken, getNewTokenError] =
      await this.shipheroAuthRepository.getNewToken();
    if (getNewTokenError) {
      return [undefined, getNewTokenError];
    }

    // Instantiates a client
    const client = new SecretManagerServiceClient();
    const parent = 'projects/441786500914/secrets/shiphero_key';

    await client.addSecretVersion({
      parent,
      payload: { data: Buffer.from(`Bearer ${newToken}`, 'utf8') },
    });

    return ['OK'];
  }
}
