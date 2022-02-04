-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerNutritionNeed" (
    "customerNutritionNeedId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "nutritionValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerNutritionNeed_pkey" PRIMARY KEY ("customerNutritionNeedId","customerId")
);

-- CreateTable
CREATE TABLE "CustomerNutritionNeed" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerNutritionNeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerNutritionNeed_label_key" ON "CustomerNutritionNeed"("label");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerNutritionNeed" ADD CONSTRAINT "IntermediateCustomerNutritionNeed_customerNutritionNeedId_fkey" FOREIGN KEY ("customerNutritionNeedId") REFERENCES "CustomerNutritionNeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerNutritionNeed" ADD CONSTRAINT "IntermediateCustomerNutritionNeed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
