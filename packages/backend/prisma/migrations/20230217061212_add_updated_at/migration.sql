/*
  Warnings:

  - Added the required column `updated_at` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tokens` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
