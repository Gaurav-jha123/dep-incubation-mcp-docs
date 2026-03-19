-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_matrix" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "skill_level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "skill_matrix_user_id_idx" ON "skill_matrix"("user_id");

-- CreateIndex
CREATE INDEX "skill_matrix_topic_id_idx" ON "skill_matrix"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_matrix_user_id_topic_id_key" ON "skill_matrix"("user_id", "topic_id");

-- AddForeignKey
ALTER TABLE "skill_matrix" ADD CONSTRAINT "skill_matrix_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_matrix" ADD CONSTRAINT "skill_matrix_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
