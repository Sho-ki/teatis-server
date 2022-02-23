-- CreateTable
CREATE TABLE "IntermediateCustomerProductFoodType" (
    "customerProductFoodTypeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "nutritionValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerProductFoodType_pkey" PRIMARY KEY ("customerProductFoodTypeId","customerId")
);

-- CreateTable
CREATE TABLE "CustomerProductFoodType" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerProductFoodType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateProductFoodType" (
    "customerProductFoodTypeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "nutritionValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductFoodType_pkey" PRIMARY KEY ("customerProductFoodTypeId","productId")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerFlavorDislike" (
    "productFlavorId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerFlavorDislike_pkey" PRIMARY KEY ("productFlavorId","customerId")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerCategoryRank" (
    "productCategoryId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerCategoryRank_pkey" PRIMARY KEY ("productCategoryId","customerId")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerIngredientDislike" (
    "productIngredientId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerIngredientDislike_pkey" PRIMARY KEY ("productIngredientId","customerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProductFoodType_label_key" ON "CustomerProductFoodType"("label");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerProductFoodType" ADD CONSTRAINT "IntermediateCustomerProductFoodType_customerProductFoodTyp_fkey" FOREIGN KEY ("customerProductFoodTypeId") REFERENCES "CustomerProductFoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerProductFoodType" ADD CONSTRAINT "IntermediateCustomerProductFoodType_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductFoodType" ADD CONSTRAINT "IntermediateProductFoodType_customerProductFoodTypeId_fkey" FOREIGN KEY ("customerProductFoodTypeId") REFERENCES "CustomerProductFoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductFoodType" ADD CONSTRAINT "IntermediateProductFoodType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerFlavorDislike" ADD CONSTRAINT "IntermediateCustomerFlavorDislike_productFlavorId_fkey" FOREIGN KEY ("productFlavorId") REFERENCES "ProductFlavor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerFlavorDislike" ADD CONSTRAINT "IntermediateCustomerFlavorDislike_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCategoryRank" ADD CONSTRAINT "IntermediateCustomerCategoryRank_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCategoryRank" ADD CONSTRAINT "IntermediateCustomerCategoryRank_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerIngredientDislike" ADD CONSTRAINT "IntermediateCustomerIngredientDislike_productIngredientId_fkey" FOREIGN KEY ("productIngredientId") REFERENCES "ProductIngredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerIngredientDislike" ADD CONSTRAINT "IntermediateCustomerIngredientDislike_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
