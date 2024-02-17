-- CreateTable
CREATE TABLE "Events" (
    "id" BIGSERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "frequency" "Frequency" NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);
