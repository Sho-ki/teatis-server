/*
  Warnings:

  - The primary key for the `CustomerCoachHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `conversationSummary` on the `CustomerCoachHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId,coachId]` on the table `CustomerCoachHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CustomerCoachHistory" DROP CONSTRAINT "CustomerCoachHistory_pkey",
DROP COLUMN "conversationSummary",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CustomerCoachHistory_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ConversationSummary" (
    "id" SERIAL NOT NULL,
    "customerCoachHistoryId" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCoachHistory_customerId_coachId_key" ON "CustomerCoachHistory"("customerId", "coachId");

-- AddForeignKey
ALTER TABLE "ConversationSummary" ADD CONSTRAINT "ConversationSummary_customerCoachHistoryId_fkey" FOREIGN KEY ("customerCoachHistoryId") REFERENCES "CustomerCoachHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
