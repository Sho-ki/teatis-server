-- CreateTable
CREATE TABLE "Discoveries" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "typeform_id" TEXT NOT NULL,
    "BMR" INTEGER NOT NULL,
    "carbs_macronutrients" INTEGER NOT NULL,
    "protein_macronutrients" INTEGER NOT NULL,
    "fat_macronutrients" INTEGER NOT NULL,
    "carbs_per_meal" INTEGER NOT NULL,
    "protein_per_meal" INTEGER NOT NULL,
    "fat_per_meal" INTEGER NOT NULL,
    "calorie_per_meal" INTEGER NOT NULL,

    CONSTRAINT "Discoveries_pkey" PRIMARY KEY ("id")
);
