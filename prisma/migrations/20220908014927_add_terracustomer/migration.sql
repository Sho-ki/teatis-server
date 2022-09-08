-- AlterTable
ALTER TABLE "SurveyQuestion" ADD COLUMN     "activeStatus" "ActiveStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "TerraCustomer" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "terraCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TerraCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TerraCustomerLog" (
    "id" SERIAL NOT NULL,
    "terraCustomerKeyId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "timestampUtc" TIMESTAMP(3) NOT NULL,
    "glucoseValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TerraCustomerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFoodLog" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "timestampUtc" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerFoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TerraCustomer_customerId_key" ON "TerraCustomer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "TerraCustomer_terraCustomerId_key" ON "TerraCustomer"("terraCustomerId");

-- AddForeignKey
ALTER TABLE "TerraCustomer" ADD CONSTRAINT "TerraCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerraCustomerLog" ADD CONSTRAINT "TerraCustomerLog_terraCustomerKeyId_fkey" FOREIGN KEY ("terraCustomerKeyId") REFERENCES "TerraCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFoodLog" ADD CONSTRAINT "CustomerFoodLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFoodLog" ADD CONSTRAINT "CustomerFoodLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
