/*
  Warnings:

  - You are about to drop the column `dalayDaysSincePurchase` on the `AutoMessage` table. All the data in the column will be lost.
  - Added the required column `delayDaysSincePurchase` to the `AutoMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AutoMessage" DROP COLUMN "dalayDaysSincePurchase",
ADD COLUMN     "delayDaysSincePurchase" INTEGER NOT NULL;
