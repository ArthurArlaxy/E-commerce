/*
  Warnings:

  - You are about to drop the column `capa` on the `ProductImages` table. All the data in the column will be lost.
  - You are about to drop the column `ordem` on the `ProductImages` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCover` to the `ProductImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ProductImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductImages" DROP COLUMN "capa",
DROP COLUMN "ordem",
ADD COLUMN     "isCover" BOOLEAN NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;
