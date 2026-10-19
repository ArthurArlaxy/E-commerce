/*
  Warnings:

  - You are about to drop the column `abacatePayProductId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_abacatePayProductId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "abacatePayProductId";
