-- DropForeignKey
ALTER TABLE "public"."Rent" DROP CONSTRAINT "Rent_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rent" DROP CONSTRAINT "Rent_renterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rent" DROP CONSTRAINT "Rent_vanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_rentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Van" DROP CONSTRAINT "Van_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "public"."Rent";

-- DropTable
DROP TABLE "public"."Review";

-- DropTable
DROP TABLE "public"."Transaction";

-- DropTable
DROP TABLE "public"."UserInfo";

-- DropTable
DROP TABLE "public"."Van";

-- DropTable
DROP TABLE "public"."account";

-- DropTable
DROP TABLE "public"."session";

-- DropTable
DROP TABLE "public"."user";

-- DropTable
DROP TABLE "public"."verification";

-- DropEnum
DROP TYPE "public"."TransactionType";

-- DropEnum
DROP TYPE "public"."VanState";

-- DropEnum
DROP TYPE "public"."VanType";

