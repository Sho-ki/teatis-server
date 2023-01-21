/*
  Warnings:

  - Changed the type of `name` on the `CronMetadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cronMetadataName` on the `WebhookEvents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CronMetadataName" AS ENUM ('updateOrder');

-- DropForeignKey
ALTER TABLE "WebhookEvents" DROP CONSTRAINT "WebhookEvents_cronMetadataName_fkey";

-- AlterTable
ALTER TABLE "CronMetadata" DROP COLUMN "name",
ADD COLUMN     "name" "CronMetadataName" NOT NULL;

-- AlterTable
ALTER TABLE "WebhookEvents" DROP COLUMN "cronMetadataName",
ADD COLUMN     "cronMetadataName" "CronMetadataName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CronMetadata_name_key" ON "CronMetadata"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvents_apiId_cronMetadataName_key" ON "WebhookEvents"("apiId", "cronMetadataName");

-- AddForeignKey
ALTER TABLE "WebhookEvents" ADD CONSTRAINT "WebhookEvents_cronMetadataName_fkey" FOREIGN KEY ("cronMetadataName") REFERENCES "CronMetadata"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
