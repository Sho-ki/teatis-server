/*
  Warnings:

  - The values [completed] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completedAt` on the `QueuedShopifyOrder` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueueStatus_new" AS ENUM ('scheduled', 'ordered', 'fullfilled');
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" TYPE "QueueStatus_new" USING ("status"::text::"QueueStatus_new");
ALTER TYPE "QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "QueueStatus_old";
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" SET DEFAULT 'scheduled';
COMMIT;

-- AlterTable
ALTER TABLE "QueuedShopifyOrder" DROP COLUMN "completedAt",
ADD COLUMN     "orderedAt" TEXT;
