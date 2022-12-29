/*
  Warnings:

  - You are about to drop the `AutoMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AutoMessageMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutoMessageMedia" DROP CONSTRAINT "AutoMessageMedia_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_autoMessageId_fkey";

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "sequenceBasedAutoMessageInterval" INTEGER,
ADD COLUMN     "twilioChannelSid" TEXT,
ALTER COLUMN "boxSubscribed" SET DEFAULT 'inactive',
ALTER COLUMN "coachingSubscribed" SET DEFAULT 'inactive';

-- DropTable
DROP TABLE "AutoMessage";

-- DropTable
DROP TABLE "AutoMessageMedia";

-- DropTable
DROP TABLE "Content";

-- CreateTable
CREATE TABLE "PurchaseDateBasedMessage" (
    "id" SERIAL NOT NULL,
    "delayDaysSincePurchase" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseDateBasedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDateBasedAutoMessageMedia" (
    "id" SERIAL NOT NULL,
    "urlTemplate" TEXT NOT NULL,
    "variable" "VariableType",
    "type" "MediaType" NOT NULL,
    "purchaseDateBasedAutoMessageContentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseDateBasedAutoMessageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDateBasedAutoMessageContent" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "purchaseDateBasedMessageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseDateBasedAutoMessageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceBasedAutoMessage" (
    "id" SERIAL NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SequenceBasedAutoMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceBasedAutoMessageContent" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "SequenceBasedAutoMessageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SequenceBasedAutoMessageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceBasedAutoMessageMedia" (
    "id" SERIAL NOT NULL,
    "urlTemplate" TEXT NOT NULL,
    "variable" "VariableType",
    "type" "MediaType" NOT NULL,
    "sequenceBasedAutoMessageContentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SequenceBasedAutoMessageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerSequenceBasedAutoMessageHistory" (
    "sequenceBasedAutoMessageId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerSequenceBasedAutoMessageHistory_pkey" PRIMARY KEY ("sequenceBasedAutoMessageId","customerId")
);

-- AddForeignKey
ALTER TABLE "PurchaseDateBasedAutoMessageMedia" ADD CONSTRAINT "PurchaseDateBasedAutoMessageMedia_purchaseDateBasedAutoMes_fkey" FOREIGN KEY ("purchaseDateBasedAutoMessageContentId") REFERENCES "PurchaseDateBasedAutoMessageContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDateBasedAutoMessageContent" ADD CONSTRAINT "PurchaseDateBasedAutoMessageContent_purchaseDateBasedMessa_fkey" FOREIGN KEY ("purchaseDateBasedMessageId") REFERENCES "PurchaseDateBasedMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceBasedAutoMessageContent" ADD CONSTRAINT "SequenceBasedAutoMessageContent_SequenceBasedAutoMessageId_fkey" FOREIGN KEY ("SequenceBasedAutoMessageId") REFERENCES "SequenceBasedAutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceBasedAutoMessageMedia" ADD CONSTRAINT "SequenceBasedAutoMessageMedia_sequenceBasedAutoMessageCont_fkey" FOREIGN KEY ("sequenceBasedAutoMessageContentId") REFERENCES "SequenceBasedAutoMessageContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerSequenceBasedAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerSequenceBasedAutoMessageHistory_custom_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerSequenceBasedAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerSequenceBasedAutoMessageHistory_sequen_fkey" FOREIGN KEY ("sequenceBasedAutoMessageId") REFERENCES "SequenceBasedAutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
