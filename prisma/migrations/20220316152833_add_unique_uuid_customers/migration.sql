/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customers_uuid_key" ON "Customers"("uuid");
