/*
  Warnings:

  - Added the required column `category` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "duration" DROP DEFAULT;
