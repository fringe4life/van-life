-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "VanType" AS ENUM ('SIMPLE', 'LUXURY', 'RUGGED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'RENTAL_PAYMENT', 'RENTAL_RETURN');

-- CreateEnum
CREATE TYPE "VanState" AS ENUM ('IN_REPAIR', 'ON_SALE', 'AVAILABLE');

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" UUID NOT NULL,
    "renterId" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "rentedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentedTo" DATE,
    "vanId" UUID NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "text" VARCHAR(512) NOT NULL,
    "userId" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "rentId" UUID NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" UUID NOT NULL,
    "rentId" UUID,
    "description" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Van" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "price" SMALLINT NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" "VanType" NOT NULL,
    "hostId" UUID NOT NULL,
    "isRented" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "VanState" DEFAULT 'AVAILABLE',
    "discount" SMALLINT DEFAULT 0,
    "slug" VARCHAR(70) NOT NULL,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "Rent_rentedTo_idx" ON "Rent"("rentedTo");

-- CreateIndex
CREATE INDEX "Rent_vanId_idx" ON "Rent"("vanId");

-- CreateIndex
CREATE INDEX "Rent_renterId_idx" ON "Rent"("renterId");

-- CreateIndex
CREATE INDEX "Rent_hostId_idx" ON "Rent"("hostId");

-- CreateIndex
CREATE INDEX "Rent_renterId_rentedTo_idx" ON "Rent"("renterId", "rentedTo");

-- CreateIndex
CREATE INDEX "Rent_hostId_rentedTo_idx" ON "Rent"("hostId", "rentedTo");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating" DESC);

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_rentId_idx" ON "Transaction"("rentId");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Transaction_userId_type_idx" ON "Transaction"("userId", "type");

-- CreateIndex
CREATE INDEX "Transaction_userId_createdAt_idx" ON "Transaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_userId_amount_idx" ON "Transaction"("userId", "amount");

-- CreateIndex
CREATE INDEX "Transaction_userId_type_createdAt_idx" ON "Transaction"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_userId_type_amount_idx" ON "Transaction"("userId", "type", "amount");

-- CreateIndex
CREATE UNIQUE INDEX "Van_name_key" ON "Van"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Van_slug_key" ON "Van"("slug");

-- CreateIndex
CREATE INDEX "Van_slug_idx" ON "Van"("slug");

-- CreateIndex
CREATE INDEX "Van_hostId_idx" ON "Van"("hostId");

-- CreateIndex
CREATE INDEX "Van_type_idx" ON "Van"("type");

-- CreateIndex
CREATE INDEX "Van_hostId_id_idx" ON "Van"("hostId", "id" DESC);

-- CreateIndex
CREATE INDEX "Van_type_id_idx" ON "Van"("type", "id");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "Van"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Van" ADD CONSTRAINT "Van_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
