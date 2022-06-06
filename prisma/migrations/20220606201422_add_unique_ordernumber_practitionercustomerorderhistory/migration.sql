/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `PractitionerCustomerOrderHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PractitionerCustomerOrderHistory_orderNumber_key" ON "PractitionerCustomerOrderHistory"("orderNumber");
