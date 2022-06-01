import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

export interface RdBoxRepoInterface {}

@Injectable()
export class RdBoxRepo implements RdBoxRepoInterface {
  constructor(private prisma: PrismaService) {}
}
