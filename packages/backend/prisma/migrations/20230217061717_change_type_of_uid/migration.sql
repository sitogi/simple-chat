/*
  Warnings:

  - You are about to alter the column `user_id` on the `Tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Tokens` MODIFY `user_id` INTEGER NOT NULL;
