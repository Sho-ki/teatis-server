-- CreateEnum
CREATE TYPE "ValidStatus" AS ENUM ('valid', 'invalid', 'pending');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "phoneStatus" "ValidStatus" DEFAULT 'pending',
ALTER COLUMN "sequenceBasedAutoMessageInterval" SET DEFAULT 7;
