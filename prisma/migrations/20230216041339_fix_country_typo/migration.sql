/*
  Warnings:

  - The `country` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('US');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "country",
ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'US';

-- DropEnum
DROP TYPE "County";
