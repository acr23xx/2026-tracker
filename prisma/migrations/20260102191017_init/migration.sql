-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "weight" REAL,
    "wakeBefore8am" BOOLEAN NOT NULL DEFAULT false,
    "laFitness" BOOLEAN NOT NULL DEFAULT false,
    "steps10k" BOOLEAN NOT NULL DEFAULT false,
    "intermittentFast" BOOLEAN NOT NULL DEFAULT false,
    "screenTime" REAL,
    "caffeine" REAL,
    "alcoholUsed" BOOLEAN NOT NULL DEFAULT false,
    "weedUsed" BOOLEAN NOT NULL DEFAULT false,
    "fastFood" BOOLEAN NOT NULL DEFAULT false,
    "phoneFreeEvening" BOOLEAN NOT NULL DEFAULT false,
    "phoneFreeDate" BOOLEAN NOT NULL DEFAULT false,
    "pickleball" BOOLEAN NOT NULL DEFAULT false,
    "golf" BOOLEAN NOT NULL DEFAULT false,
    "liveEvent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT '',
    "dateFinished" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "dateWatched" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OneTimeGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dateCompleted" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_date_key" ON "DailyLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "OneTimeGoal_id_key" ON "OneTimeGoal"("id");
