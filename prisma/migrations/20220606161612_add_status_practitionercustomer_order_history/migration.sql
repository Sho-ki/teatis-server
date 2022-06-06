/*
  Warnings:

  - Added the required column `status` to the `PractitionerCustomerOrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "QueueStatus" ADD VALUE 'canceled';

-- AlterTable
ALTER TABLE "PractitionerCustomerOrderHistory" ADD COLUMN     "status" "QueueStatus" NOT NULL;
