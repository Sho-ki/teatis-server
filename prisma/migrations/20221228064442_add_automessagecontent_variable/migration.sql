/*
  Warnings:

  - The `variable` column on the `PurchaseDateBasedAutoMessageMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `variable` column on the `SequenceBasedAutoMessageMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "ActiveStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "PurchaseDateBasedAutoMessageContent" ADD COLUMN     "variable" JSONB;

-- AlterTable
ALTER TABLE "PurchaseDateBasedAutoMessageMedia" DROP COLUMN "variable",
ADD COLUMN     "variable" JSONB;

-- AlterTable
ALTER TABLE "SequenceBasedAutoMessageContent" ADD COLUMN     "variable" JSONB;

-- AlterTable
ALTER TABLE "SequenceBasedAutoMessageMedia" DROP COLUMN "variable",
ADD COLUMN     "variable" JSONB;

-- DropEnum
DROP TYPE "MessageStatus";

-- DropEnum
DROP TYPE "VariableType";
