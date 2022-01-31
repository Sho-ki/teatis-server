-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerNutrition" (
    "customer_nutrition_item_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "nutrition_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerNutrition_pkey" PRIMARY KEY ("customer_nutrition_item_id","customer_id")
);

-- CreateTable
CREATE TABLE "CustomerNutritionItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerNutritionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerMedicalCondition" (
    "medical_condition_value" TEXT NOT NULL,
    "customer_medical_condition_item_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerMedicalCondition_pkey" PRIMARY KEY ("customer_medical_condition_item_id","customer_id")
);

-- CreateTable
CREATE TABLE "CustomerMedicalConditionItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerMedicalConditionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerNutritionItem_label_key" ON "CustomerNutritionItem"("label");

-- AddForeignKey
ALTER TABLE "CustomerNutrition" ADD CONSTRAINT "CustomerNutrition_customer_nutrition_item_id_fkey" FOREIGN KEY ("customer_nutrition_item_id") REFERENCES "CustomerNutritionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNutrition" ADD CONSTRAINT "CustomerNutrition_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMedicalCondition" ADD CONSTRAINT "CustomerMedicalCondition_customer_medical_condition_item_i_fkey" FOREIGN KEY ("customer_medical_condition_item_id") REFERENCES "CustomerMedicalConditionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMedicalCondition" ADD CONSTRAINT "CustomerMedicalCondition_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
