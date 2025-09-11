-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('deposit', 'withdraw');

-- CreateEnum
CREATE TYPE "public"."VanState" AS ENUM ('new', 'in_repair', 'on_sale', 'available');

-- AlterTable
ALTER TABLE "public"."Van" ADD COLUMN     "state" "public"."VanState" NOT NULL DEFAULT 'new';

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Van_state_idx" ON "public"."Van"("state");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
