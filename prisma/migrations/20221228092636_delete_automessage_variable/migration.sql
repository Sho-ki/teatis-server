/*
  Warnings:

  - You are about to drop the column `variable` on the `PurchaseDateBasedAutoMessageContent` table. All the data in the column will be lost.
  - You are about to drop the column `variable` on the `PurchaseDateBasedAutoMessageMedia` table. All the data in the column will be lost.
  - You are about to drop the column `variable` on the `SequenceBasedAutoMessageContent` table. All the data in the column will be lost.
  - You are about to drop the column `variable` on the `SequenceBasedAutoMessageMedia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseDateBasedAutoMessageContent" DROP COLUMN "variable";

-- AlterTable
ALTER TABLE "PurchaseDateBasedAutoMessageMedia" DROP COLUMN "variable";

-- AlterTable
ALTER TABLE "SequenceBasedAutoMessageContent" DROP COLUMN "variable";

-- AlterTable
ALTER TABLE "SequenceBasedAutoMessageMedia" DROP COLUMN "variable";
