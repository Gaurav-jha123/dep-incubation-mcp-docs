CREATE TYPE "AssignmentStatus" AS ENUM ('PROPOSED', 'PRESELECTED', 'BOOKED', 'ASSIGNED', 'ONBOARDED');

ALTER TABLE "projects" ADD COLUMN "skill_ids" INTEGER[] NOT NULL DEFAULT '{}';

ALTER TABLE "projects" ADD COLUMN "code" TEXT;
UPDATE "projects" SET "code" = 'PRJ-' || id WHERE "code" IS NULL;
ALTER TABLE "projects" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

ALTER TABLE "project_assignments" ADD COLUMN "status" "AssignmentStatus" NOT NULL DEFAULT 'PRESELECTED';

DROP TABLE "project_skills";

