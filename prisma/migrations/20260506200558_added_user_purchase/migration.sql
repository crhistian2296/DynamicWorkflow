/*
  Warnings:

  - Added the required column `credits` to the `UserPurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packId` to the `UserPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "packId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserPurchase" ("amount", "currency", "date", "description", "id", "stripeId", "userId") SELECT "amount", "currency", "date", "description", "id", "stripeId", "userId" FROM "UserPurchase";
DROP TABLE "UserPurchase";
ALTER TABLE "new_UserPurchase" RENAME TO "UserPurchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
