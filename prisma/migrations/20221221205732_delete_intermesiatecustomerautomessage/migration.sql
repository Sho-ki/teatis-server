/*
  Warnings:

  - You are about to drop the column `daysSincePurchase` on the `AutoMessage` table. All the data in the column will be lost.
  - You are about to drop the `IntermediateCustomerAutoMessageHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageMedia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dalayDaysSincePurchase` to the `AutoMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" DROP CONSTRAINT "IntermediateCustomerAutoMessageHistory_autoMessageId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" DROP CONSTRAINT "IntermediateCustomerAutoMessageHistory_contentId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerAutoMessageHistory" DROP CONSTRAINT "IntermediateCustomerAutoMessageHistory_customerId_fkey";

-- DropForeignKey
ALTER TABLE "MessageMedia" DROP CONSTRAINT "MessageMedia_intermediateCustomerAutoMessageHistoryId_fkey";

-- AlterTable
ALTER TABLE "AutoMessage" DROP COLUMN "daysSincePurchase",
ADD COLUMN     "dalayDaysSincePurchase" INTEGER NOT NULL;

-- DropTable
DROP TABLE "IntermediateCustomerAutoMessageHistory";

-- DropTable
DROP TABLE "MessageMedia";

-- CreateTable
CREATE TABLE "AutoMessageMedia" (
    "id" SERIAL NOT NULL,
    "urlTemplate" TEXT NOT NULL,
    "variable" JSONB,
    "type" "MediaType" NOT NULL,
    "contentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoMessageMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutoMessageMedia" ADD CONSTRAINT "AutoMessageMedia_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
