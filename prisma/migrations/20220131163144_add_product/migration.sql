-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "product_povider_id" INTEGER NOT NULL,
    "external_id" INTEGER NOT NULL,
    "upc_code" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
