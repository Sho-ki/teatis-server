-- CreateEnum
CREATE TYPE "RewardEventType" AS ENUM ('sendMessage', 'completgeWeeklyCheckIn', 'achieveWeeklyGoal', 'exchangePoints', 'customPoints');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "points" INTEGER DEFAULT 100;

-- CreateTable
CREATE TABLE "CustomerPointLog" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "RewardEventType" NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "CustomerPointLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointExchangeHistory" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL,

    CONSTRAINT "PointExchangeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangedProduct" (
    "pointExchangeHistoryId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ExchangedProduct_pkey" PRIMARY KEY ("pointExchangeHistoryId","productId")
);

-- AddForeignKey
ALTER TABLE "CustomerPointLog" ADD CONSTRAINT "CustomerPointLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointExchangeHistory" ADD CONSTRAINT "PointExchangeHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangedProduct" ADD CONSTRAINT "ExchangedProduct_pointExchangeHistoryId_fkey" FOREIGN KEY ("pointExchangeHistoryId") REFERENCES "PointExchangeHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangedProduct" ADD CONSTRAINT "ExchangedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
