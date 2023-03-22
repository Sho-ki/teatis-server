/*
  Warnings:

  - The values [completgeWeeklyCheckIn] on the enum `RewardEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RewardEventType_new" AS ENUM ('sendMessage', 'completeWeeklyCheckIn', 'achieveWeeklyGoal', 'exchangePoints', 'customPoints');
ALTER TABLE "CustomerPointLog" ALTER COLUMN "type" TYPE "RewardEventType_new" USING ("type"::text::"RewardEventType_new");
ALTER TYPE "RewardEventType" RENAME TO "RewardEventType_old";
ALTER TYPE "RewardEventType_new" RENAME TO "RewardEventType";
DROP TYPE "RewardEventType_old";
COMMIT;

-- CreateTable
CREATE TABLE "OneTimeCode" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'active',
    "validUntil" TIMESTAMP(3) NOT NULL DEFAULT (now() + '7 days'::interval),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneTimeCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OneTimeCode_uuid_key" ON "OneTimeCode"("uuid");
