import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

export interface DiscoveriesRepoInterface {
  checkIfExists(typeform_id: string): Promise<boolean>;
  createDiscovery(data: Prisma.DiscoveriesCreateInput): Promise<Discoveries>;
}

@Injectable()
export class DiscoveriesRepo implements DiscoveriesRepoInterface {
  constructor(private prisma: PrismaService) {}

  async checkIfExists(typeform_id: string): Promise<boolean> {
    const findDiscoveryByTypeformId = await this.prisma.discoveries.findMany({
      where: { typeform_id },
    });
    return findDiscoveryByTypeformId.length ? true : false;
  }

  async createDiscovery(
    data: Prisma.DiscoveriesCreateInput,
  ): Promise<Discoveries> {
    return this.prisma.discoveries.create({ data });
  }
}
