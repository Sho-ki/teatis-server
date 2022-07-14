-- CreateEnum
CREATE TYPE "CustomerBoxPlan" AS ENUM ('SoupAndSnack', 'SweetsAndSnack', 'DinnerAndSnack', 'BreakfastAndSnack', 'SweetsOnly');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "boxPlan" "CustomerBoxPlan";
