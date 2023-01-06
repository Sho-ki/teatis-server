-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('coachingSubscribed', 'coachingUnsubscribed', 'boxSubscribed', 'boxUnsubscribed');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('mp3', 'mp4', 'image', 'webPage');

-- CreateEnum
CREATE TYPE "MessageTimePreference" AS ENUM ('at0', 'at3', 'at6', 'at9', 'at12', 'at15', 'at18', 'at21');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('success', 'failed');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "boxSubscribed" "ActiveStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "coachingSubscribed" "ActiveStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "messageTimePreference" "MessageTimePreference" NOT NULL DEFAULT 'at18';

-- CreateTable
CREATE TABLE "CustomerEventLog" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,

    CONSTRAINT "CustomerEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerAutoMessageHistory" (
    "id" SERIAL NOT NULL,
    "autoMessageId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "twilioSid" TEXT,
    "twilioLog" JSONB,
    "status" "MessageStatus" NOT NULL,
    "contentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerAutoMessageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageMedia" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "intermediateCustomerAutoMessageHistoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoMessage" (
    "id" SERIAL NOT NULL,
    "daysSincePurchase" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "autoMessageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerEventLog" ADD CONSTRAINT "CustomerEventLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_autoMessageId_fkey" FOREIGN KEY ("autoMessageId") REFERENCES "AutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMedia" ADD CONSTRAINT "MessageMedia_intermediateCustomerAutoMessageHistoryId_fkey" FOREIGN KEY ("intermediateCustomerAutoMessageHistoryId") REFERENCES "IntermediateCustomerAutoMessageHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_autoMessageId_fkey" FOREIGN KEY ("autoMessageId") REFERENCES "AutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
