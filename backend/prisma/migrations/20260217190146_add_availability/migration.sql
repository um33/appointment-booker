/*
  Warnings:

  - A unique constraint covering the columns `[businessId,userId,dayOfWeek,startTime,endTime]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Availability_businessId_userId_dayOfWeek_startTime_endTime_key" ON "Availability"("businessId", "userId", "dayOfWeek", "startTime", "endTime");
