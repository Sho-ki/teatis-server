-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('google');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('bearer');

-- CreateTable
CREATE TABLE "CustomerOAuth2" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiredAt" TIMESTAMP(3),
    "tokenType" "TokenType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerOAuth2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSession" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sessionIdHash" TEXT,
    "expiredAt" TIMESTAMP(3),
    "activeUntil" TIMESTAMP(3) NOT NULL DEFAULT (now() + '1 year'::interval),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSessionStore" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOAuth2_customerId_provider_key" ON "CustomerOAuth2"("customerId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSession_sessionId_key" ON "CustomerSession"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSession_sessionIdHash_key" ON "CustomerSession"("sessionIdHash");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "CustomerSessionStore"("expire");

-- AddForeignKey
ALTER TABLE "CustomerOAuth2" ADD CONSTRAINT "CustomerOAuth2_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSession" ADD CONSTRAINT "CustomerSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
