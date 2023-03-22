
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const migrateProductToRewardItem = async() => {

  const client = new PrismaClient();

  const allProducts = await client.product.findMany({ where: { rewardItem: { is: null } } });
  // create reward items
  await client.rewardItem.createMany({
    data: allProducts.map((product) => {
      return {
        pointValue: 100,
        productId: product.id,
      };
    }),
  });

};

migrateProductToRewardItem();
