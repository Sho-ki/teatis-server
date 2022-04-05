-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "activeStatus" "ActiveStatus" DEFAULT E'active';
