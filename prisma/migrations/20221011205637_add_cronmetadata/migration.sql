-- CreateTable
CREATE TABLE "CronMetadata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CronMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvents" (
    "id" SERIAL NOT NULL,
    "apiId" TEXT NOT NULL,
    "cronMetadataName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronMetadata_name_key" ON "CronMetadata"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvents_apiId_cronMetadataName_key" ON "WebhookEvents"("apiId", "cronMetadataName");

-- AddForeignKey
ALTER TABLE "WebhookEvents" ADD CONSTRAINT "WebhookEvents_cronMetadataName_fkey" FOREIGN KEY ("cronMetadataName") REFERENCES "CronMetadata"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
