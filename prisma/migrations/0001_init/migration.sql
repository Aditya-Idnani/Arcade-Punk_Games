CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "GameCategory" AS ENUM ('ARCADE', 'PUZZLE', 'LOGIC', 'STRATEGY', 'REFLEX');

CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "games" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "GameCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "achievements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");
CREATE INDEX "idx_scores_user_game" ON "scores"("user_id", "game_id");
CREATE INDEX "idx_scores_game_score" ON "scores"("game_id", "score" DESC);
CREATE INDEX "idx_achievements_user" ON "achievements"("user_id");

ALTER TABLE "scores"
ADD CONSTRAINT "scores_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "scores"
ADD CONSTRAINT "scores_game_id_fkey"
FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "achievements"
ADD CONSTRAINT "achievements_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
