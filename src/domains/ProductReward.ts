import { RewardItem } from '@prisma/client';
import { DisplayProduct } from './Product';

export interface TeatisProductReward extends RewardItem {
    product: DisplayProduct;
}
