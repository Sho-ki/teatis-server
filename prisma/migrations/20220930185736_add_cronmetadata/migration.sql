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
    "cronMetadataId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronMetadata_name_key" ON "CronMetadata"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvents_apiId_key" ON "WebhookEvents"("apiId");

-- AddForeignKey
ALTER TABLE "WebhookEvents" ADD CONSTRAINT "WebhookEvents_cronMetadataId_fkey" FOREIGN KEY ("cronMetadataId") REFERENCES "CronMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
