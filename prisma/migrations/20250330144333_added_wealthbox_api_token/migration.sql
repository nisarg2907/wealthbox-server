-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_wealthbox_authenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wealthbox_api_token" TEXT;
