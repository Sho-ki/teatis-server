-- CreateTable
CREATE TABLE "MicroGoalCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MicroGoalCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroGoal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MicroGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionStep" (
    "id" SERIAL NOT NULL,
    "mainText" TEXT NOT NULL,
    "subText" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "microGoalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerMicroGoal" (
    "id" SERIAL NOT NULL,
    "microGoalId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "CustomerMicroGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActionStep" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "actionStepId" INTEGER NOT NULL,
    "customerMicroGoalId" INTEGER NOT NULL,
    "customizedMainText" TEXT,
    "customizedSubText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerActionStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MicroGoalCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroGoal" ADD CONSTRAINT "MicroGoal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MicroGoalCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" ADD CONSTRAINT "ActionStep_microGoalId_fkey" FOREIGN KEY ("microGoalId") REFERENCES "MicroGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMicroGoal" ADD CONSTRAINT "CustomerMicroGoal_microGoalId_fkey" FOREIGN KEY ("microGoalId") REFERENCES "MicroGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMicroGoal" ADD CONSTRAINT "CustomerMicroGoal_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActionStep" ADD CONSTRAINT "CustomerActionStep_customerMicroGoalId_fkey" FOREIGN KEY ("customerMicroGoalId") REFERENCES "CustomerMicroGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActionStep" ADD CONSTRAINT "CustomerActionStep_actionStepId_fkey" FOREIGN KEY ("actionStepId") REFERENCES "ActionStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
