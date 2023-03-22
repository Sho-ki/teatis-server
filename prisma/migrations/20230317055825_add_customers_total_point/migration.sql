/*
  Warnings:

  - You are about to drop the `ExchangedProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OneTimeCode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[twilioChannelSid]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ExchangedProduct" DROP CONSTRAINT "ExchangedProduct_pointExchangeHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "ExchangedProduct" DROP CONSTRAINT "ExchangedProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ExchangedProduct";

-- DropTable
DROP TABLE "OneTimeCode";

-- CreateTable
CREATE TABLE "PointExchangeHistoryItem" (
    "pointExchangeHistoryId" INTEGER NOT NULL,
    "rewardItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointExchangeHistoryItem_pkey" PRIMARY KEY ("pointExchangeHistoryId","rewardItemId")
);

-- CreateTable
CREATE TABLE "RewardItem" (
    "id" SERIAL NOT NULL,
    "label" TEXT,
    "pointValue" INTEGER NOT NULL,
    "productId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRewardToken" (
    "id" SERIAL NOT NULL,
    "pointToken" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'active',
    "validUntil" TIMESTAMP(3) NOT NULL DEFAULT (now() + '7 days'::interval),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerRewardToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerTwilioMessage" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "messageId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerTwilioMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardItem_label_key" ON "RewardItem"("label");

-- CreateIndex
CREATE UNIQUE INDEX "RewardItem_productId_key" ON "RewardItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRewardToken_pointToken_key" ON "CustomerRewardToken"("pointToken");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTwilioMessage_messageId_key" ON "CustomerTwilioMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_twilioChannelSid_key" ON "Customers"("twilioChannelSid");

-- AddForeignKey
ALTER TABLE "PointExchangeHistoryItem" ADD CONSTRAINT "PointExchangeHistoryItem_pointExchangeHistoryId_fkey" FOREIGN KEY ("pointExchangeHistoryId") REFERENCES "PointExchangeHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointExchangeHistoryItem" ADD CONSTRAINT "PointExchangeHistoryItem_rewardItemId_fkey" FOREIGN KEY ("rewardItemId") REFERENCES "RewardItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardItem" ADD CONSTRAINT "RewardItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRewardToken" ADD CONSTRAINT "CustomerRewardToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTwilioMessage" ADD CONSTRAINT "CustomerTwilioMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
