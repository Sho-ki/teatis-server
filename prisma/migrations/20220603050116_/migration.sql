/*
  Warnings:

  - You are about to drop the column `practitionerBoxUuid` on the `PractitionerBox` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `PractitionerCustomerOrderHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `PractitionerBox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `PractitionerBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionPrice` to the `PractitionerCustomerOrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PractitionerBox_practitionerBoxUuid_key";

-- AlterTable
ALTER TABLE "PractitionerBox" DROP COLUMN "practitionerBoxUuid",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PractitionerCustomerOrderHistory" DROP COLUMN "purchasePrice",
ADD COLUMN     "transactionPrice" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerBox_uuid_key" ON "PractitionerBox"("uuid");
