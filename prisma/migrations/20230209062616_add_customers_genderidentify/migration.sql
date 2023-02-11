-- CreateEnum
CREATE TYPE "GenderIdentify" AS ENUM ('female', 'male', 'nonBinary', 'preferNotToSay', 'other');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "genderIdentify" "GenderIdentify" NOT NULL DEFAULT 'female';
