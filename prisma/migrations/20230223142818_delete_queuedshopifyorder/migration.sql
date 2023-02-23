/*
  Warnings:

  - You are about to drop the `QueuedShopifyOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QueuedShopifyOrder" DROP CONSTRAINT "QueuedShopifyOrder_customerId_fkey";

-- DropTable
DROP TABLE "QueuedShopifyOrder";
