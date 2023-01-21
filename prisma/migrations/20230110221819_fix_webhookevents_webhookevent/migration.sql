/*
  Warnings:

  - You are about to drop the `WebhookEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WebhookEvents" DROP CONSTRAINT "WebhookEvents_cronMetadataName_fkey";

-- DropTable
DROP TABLE "WebhookEvents";

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" SERIAL NOT NULL,
    "apiId" TEXT NOT NULL,
    "cronMetadataName" "CronMetadataName" NOT NULL,
    "client" "WebhookClient" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_apiId_cronMetadataName_key" ON "WebhookEvent"("apiId", "cronMetadataName");

-- AddForeignKey
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_cronMetadataName_fkey" FOREIGN KEY ("cronMetadataName") REFERENCES "CronMetadata"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
