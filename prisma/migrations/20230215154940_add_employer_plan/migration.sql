-- CreateEnum
CREATE TYPE "County" AS ENUM ('US');

-- CreateEnum
CREATE TYPE "EligibilityStatus" AS ENUM ('eligible', 'ineligible', 'pending');

-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'boxOrdered';

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" "County" NOT NULL DEFAULT 'US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "emailEligibility" "EligibilityStatus" NOT NULL DEFAULT 'pending',
    "monthlyOrderInterval" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_customerId_key" ON "Profile"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_name_key" ON "Employer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_uuid_key" ON "Employer"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_customerId_key" ON "Employee"("customerId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
