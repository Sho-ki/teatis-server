-- CreateEnum
CREATE TYPE "MessageTimePreference" AS ENUM ('at0', 'at3', 'at6', 'at9', 'at12', 'at15', 'at18', 'at21');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('success', 'failed', 'unsubscribed');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "coachingSubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "coachingSubscribedAt" TIMESTAMP(3),
ADD COLUMN     "coachingUnsubscribedAt" TIMESTAMP(3),
ADD COLUMN     "messageTimePreference" "MessageTimePreference" NOT NULL DEFAULT 'at18';

-- CreateTable
CREATE TABLE "IntermediateCustomerAutoMessageHistory" (
    "autoMessageId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "twilioSid" TEXT,
    "twilioLog" JSONB,
    "status" "MessageStatus" NOT NULL,
    "contentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerAutoMessageHistory_pkey" PRIMARY KEY ("autoMessageId","customerId")
);

-- CreateTable
CREATE TABLE "AutoMessage" (
    "id" SERIAL NOT NULL,
    "messageCategoryId" INTEGER NOT NULL,
    "messageOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "categoryOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageCategory_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "AutoMessage_messageOrder_messageCategoryId_key" ON "AutoMessage"("messageOrder", "messageCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageCategory_category_key" ON "MessageCategory"("category");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_autoMessageId_fkey" FOREIGN KEY ("autoMessageId") REFERENCES "AutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" ADD CONSTRAINT "IntermediateCustomerAutoMessageHistory_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoMessage" ADD CONSTRAINT "AutoMessage_messageCategoryId_fkey" FOREIGN KEY ("messageCategoryId") REFERENCES "MessageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_autoMessageId_fkey" FOREIGN KEY ("autoMessageId") REFERENCES "AutoMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
