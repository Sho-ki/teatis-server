-- CreateTable
CREATE TABLE "IntermediateCustomerBoxPlan" (
    "customerBoxPlanId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerBoxPlan_pkey" PRIMARY KEY ("customerBoxPlanId","customerId")
);

-- CreateTable
CREATE TABLE "CustomerBoxPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "soupCount" INTEGER NOT NULL DEFAULT 0,
    "snackCount" INTEGER NOT NULL DEFAULT 0,
    "sweetsCount" INTEGER NOT NULL DEFAULT 0,
    "dinnerCount" INTEGER NOT NULL DEFAULT 0,
    "breakfastCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerBoxPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerBoxPlan_name_key" ON "CustomerBoxPlan"("name");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerBoxPlan" ADD CONSTRAINT "IntermediateCustomerBoxPlan_customerBoxPlanId_fkey" FOREIGN KEY ("customerBoxPlanId") REFERENCES "CustomerBoxPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerBoxPlan" ADD CONSTRAINT "IntermediateCustomerBoxPlan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
