-- CreateTable
CREATE TABLE "IntermediateCustomerCoachingPreference" (
    "customerId" INTEGER NOT NULL,
    "coachingPreferenceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerCoachingPreference_pkey" PRIMARY KEY ("coachingPreferenceId","customerId")
);

-- CreateTable
CREATE TABLE "CoachingPreference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoachingPreference_name_key" ON "CoachingPreference"("name");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCoachingPreference" ADD CONSTRAINT "IntermediateCustomerCoachingPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCoachingPreference" ADD CONSTRAINT "IntermediateCustomerCoachingPreference_coachingPreferenceI_fkey" FOREIGN KEY ("coachingPreferenceId") REFERENCES "CoachingPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
