-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentExpireAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentPaidAt" TIMESTAMP(3),
ALTER COLUMN "shippingCity" DROP DEFAULT,
ALTER COLUMN "shippingComplement" DROP DEFAULT,
ALTER COLUMN "shippingNeighborhood" DROP DEFAULT,
ALTER COLUMN "shippingNumber" DROP DEFAULT,
ALTER COLUMN "shippingState" DROP DEFAULT,
ALTER COLUMN "shippingStreet" DROP DEFAULT,
ALTER COLUMN "shippingZipCode" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderProducts" ALTER COLUMN "nameSnapshot" DROP DEFAULT;
