/*
  Warnings:

  - You are about to drop the `ComponentDependency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dependency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComponentDependency" DROP CONSTRAINT "ComponentDependency_componentId_fkey";

-- DropForeignKey
ALTER TABLE "ComponentDependency" DROP CONSTRAINT "ComponentDependency_dependencyId_fkey";

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "dependencies" TEXT[];

-- DropTable
DROP TABLE "ComponentDependency";

-- DropTable
DROP TABLE "Dependency";
