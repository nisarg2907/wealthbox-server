/*
  Warnings:

  - A unique constraint covering the columns `[organizationId]` on the table `IntegrationConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IntegrationConfig_organizationId_key" ON "IntegrationConfig"("organizationId");
