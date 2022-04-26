/*
  Warnings:

  - The values [fullfilled] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueueStatus_new" AS ENUM ('scheduled', 'ordered', 'fulfilled');
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" TYPE "QueueStatus_new" USING ("status"::text::"QueueStatus_new");
ALTER TYPE "QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "QueueStatus_old";
ALTER TABLE "QueuedShopifyOrder" ALTER COLUMN "status" SET DEFAULT 'scheduled';
COMMIT;