-- CreateIndex
CREATE INDEX "IntermediatePractitionerBoxProduct_productId_idx" ON "IntermediatePractitionerBoxProduct"("productId");

-- CreateIndex
CREATE INDEX "IntermediatePractitionerBoxProduct_practitionerBoxId_idx" ON "IntermediatePractitionerBoxProduct"("practitionerBoxId");

-- CreateIndex
CREATE INDEX "PractitionerBox_uuid_idx" ON "PractitionerBox" USING HASH ("uuid");

-- CreateIndex
CREATE INDEX "PractitionerSocialMedia_practitionerId_idx" ON "PractitionerSocialMedia"("practitionerId");

-- CreateIndex
CREATE INDEX "Product_externalSku_idx" ON "Product"("externalSku");

-- CreateIndex
CREATE INDEX "ProductNutritionFact_productId_idx" ON "ProductNutritionFact"("productId");
