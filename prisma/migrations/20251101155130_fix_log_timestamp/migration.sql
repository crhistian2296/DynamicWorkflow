/*
  Warnings:

  - You are about to drop the column `tiemstamp` on the `ExecutionLog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExecutionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logLevel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionPhaseId" TEXT NOT NULL,
    CONSTRAINT "ExecutionLog_executionPhaseId_fkey" FOREIGN KEY ("executionPhaseId") REFERENCES "ExecutionPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExecutionLog" ("executionPhaseId", "id", "logLevel", "message") SELECT "executionPhaseId", "id", "logLevel", "message" FROM "ExecutionLog";
DROP TABLE "ExecutionLog";
ALTER TABLE "new_ExecutionLog" RENAME TO "ExecutionLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
