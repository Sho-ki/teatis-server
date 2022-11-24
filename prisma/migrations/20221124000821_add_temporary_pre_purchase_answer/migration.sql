-- CreateTable
CREATE TABLE "TemporaryPrePurchaseAnswer" (
    "id" SERIAL NOT NULL,
    "answerIdentifier" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "diabetes" JSONB,
    "gender" JSONB,
    "height" JSONB,
    "weight" JSONB,
    "age" JSONB,
    "medicalConditions" JSONB,
    "activeLevel" JSONB,
    "A1c" JSONB,
    "mealsPerDay" JSONB,
    "categoryPreferences" JSONB,
    "flavorDislikes" JSONB,
    "ingredientDislikes" JSONB,
    "allergens" JSONB,
    "unavailableCookingMethods" JSONB,
    "boxPlan" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemporaryPrePurchaseAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryPrePurchaseAnswer_answerIdentifier_key" ON "TemporaryPrePurchaseAnswer"("answerIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryPrePurchaseAnswer_email_key" ON "TemporaryPrePurchaseAnswer"("email");
