-- CreateTable
CREATE TABLE "Practitioner" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Practitioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerSocialMedia" (
    "id" SERIAL NOT NULL,
    "practitionerId" INTEGER NOT NULL,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerSocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerBox" (
    "id" SERIAL NOT NULL,
    "practitionerId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediatePractitionerBoxProduct" (
    "practitionerBoxId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediatePractitionerBoxProduct_pkey" PRIMARY KEY ("practitionerBoxId","productId")
);

-- CreateTable
CREATE TABLE "PractitionerCustomerOrderHistory" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "practitionerBoxId" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerCustomerOrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_uuid_key" ON "Practitioner"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_email_key" ON "Practitioner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerSocialMedia_practitionerId_key" ON "PractitionerSocialMedia"("practitionerId");

-- AddForeignKey
ALTER TABLE "PractitionerSocialMedia" ADD CONSTRAINT "PractitionerSocialMedia_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerBox" ADD CONSTRAINT "PractitionerBox_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediatePractitionerBoxProduct" ADD CONSTRAINT "IntermediatePractitionerBoxProduct_practitionerBoxId_fkey" FOREIGN KEY ("practitionerBoxId") REFERENCES "PractitionerBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediatePractitionerBoxProduct" ADD CONSTRAINT "IntermediatePractitionerBoxProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerCustomerOrderHistory" ADD CONSTRAINT "PractitionerCustomerOrderHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerCustomerOrderHistory" ADD CONSTRAINT "PractitionerCustomerOrderHistory_practitionerBoxId_fkey" FOREIGN KEY ("practitionerBoxId") REFERENCES "PractitionerBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
