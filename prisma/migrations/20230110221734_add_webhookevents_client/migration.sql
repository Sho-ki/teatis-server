/*
  Warnings:

  - Added the required column `client` to the `WebhookEvents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WebhookClient" AS ENUM ('shopify');

-- AlterTable
ALTER TABLE "WebhookEvents" ADD COLUMN     "client" "WebhookClient" NOT NULL;
