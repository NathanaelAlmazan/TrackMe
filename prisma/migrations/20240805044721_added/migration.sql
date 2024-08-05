-- CreateTable
CREATE TABLE "EventScope" (
    "eventId" BIGINT NOT NULL,
    "officeId" BIGINT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventScope_pkey" PRIMARY KEY ("eventId","officeId")
);

-- AddForeignKey
ALTER TABLE "EventScope" ADD CONSTRAINT "EventScope_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventScope" ADD CONSTRAINT "EventScope_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Offices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
