-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('standard', 'driver', 'employee');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "customerType" "CustomerType" NOT NULL DEFAULT 'standard';
