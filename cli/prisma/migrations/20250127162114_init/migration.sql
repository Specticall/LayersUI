-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDependency" (
    "componentId" INTEGER NOT NULL,
    "dependencyId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "ComponentDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dependency_id_key" ON "Dependency"("id");

-- AddForeignKey
ALTER TABLE "ComponentDependency" ADD CONSTRAINT "ComponentDependency_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentDependency" ADD CONSTRAINT "ComponentDependency_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "Dependency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
