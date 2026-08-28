/*
  Warnings:

  - You are about to drop the column `advancePaymentStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `eventAddress` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_packageId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "advancePaymentStatus",
DROP COLUMN "bookingTime",
DROP COLUMN "eventAddress",
DROP COLUMN "packageId";

-- DropTable
DROP TABLE "Package";
