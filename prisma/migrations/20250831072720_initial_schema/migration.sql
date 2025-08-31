-- CreateEnum
CREATE TYPE "public"."VanType" AS ENUM ('simple', 'luxury', 'rugged');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rent" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "renterId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "rentedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentedTo" DATE,
    "vanId" TEXT NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "text" VARCHAR(512) NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "rentId" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserInfo" (
    "userId" TEXT NOT NULL,
    "moneyAdded" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Van" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "price" SMALLINT NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" "public"."VanType" NOT NULL,
    "hostId" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "Rent_rentedTo_idx" ON "public"."Rent"("rentedTo");

-- CreateIndex
CREATE INDEX "Rent_vanId_idx" ON "public"."Rent"("vanId");

-- CreateIndex
CREATE INDEX "Rent_renterId_idx" ON "public"."Rent"("renterId");

-- CreateIndex
CREATE INDEX "Rent_hostId_idx" ON "public"."Rent"("hostId");

-- CreateIndex
CREATE INDEX "Rent_renterId_rentedTo_idx" ON "public"."Rent"("renterId", "rentedTo");

-- CreateIndex
CREATE INDEX "Rent_hostId_rentedTo_idx" ON "public"."Rent"("hostId", "rentedTo");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_rentedTo_vanId_key" ON "public"."Rent"("rentedTo", "vanId");

-- CreateIndex
CREATE INDEX "Review_rentId_userId_idx" ON "public"."Review"("rentId", "userId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId" DESC);

-- CreateIndex
CREATE INDEX "Review_rentId_idx" ON "public"."Review"("rentId" DESC);

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "public"."Review"("rating" DESC);

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "public"."Review"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Review_updatedAt_idx" ON "public"."Review"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "UserInfo_userId_idx" ON "public"."UserInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Van_name_key" ON "public"."Van"("name");

-- CreateIndex
CREATE INDEX "Van_hostId_idx" ON "public"."Van"("hostId");

-- CreateIndex
CREATE INDEX "Van_type_idx" ON "public"."Van"("type");

-- CreateIndex
CREATE INDEX "Van_id_hostId_idx" ON "public"."Van"("id" DESC, "hostId");

-- CreateIndex
CREATE INDEX "Van_isRented_idx" ON "public"."Van"("isRented");

-- CreateIndex
CREATE INDEX "Van_type_id_idx" ON "public"."Van"("type" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Van_createdAt_id_key" ON "public"."Van"("createdAt" DESC, "id" DESC);

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rent" ADD CONSTRAINT "Rent_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "public"."UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rent" ADD CONSTRAINT "Rent_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "public"."UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rent" ADD CONSTRAINT "Rent_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "public"."Van"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "public"."Rent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Van" ADD CONSTRAINT "Van_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "public"."UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
