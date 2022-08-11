import { Inject, Injectable } from '@nestjs/common';
import { ShipheroAuthRepositoryInterface } from '@Repositories/shiphero/shipheroAuth.repository';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '@Filters/customError';

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

    const secretManagerProjectId = process.env.SECRET_MANAGER_PROJECT_ID;
    // Instantiates a client
    const client = new SecretManagerServiceClient();
    const parent = `projects/${secretManagerProjectId}/secrets/shiphero_key`;

    await client.addSecretVersion({
      parent,
      payload: { data: Buffer.from(`Bearer ${newToken}`, 'utf8') },
    });

    return [{ success: true }];
  }
}
