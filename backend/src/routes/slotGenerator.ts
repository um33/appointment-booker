import { Router, Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const slotGeneratorRouter = Router();

// --- HELPER FUNCTIONS ---

const timeToMinutes = (time: string): number => {
  const [hrs, mins] = time.split(":").map(Number);
  return hrs * 60 + mins;
};

const minutesToTime = (totalMins: number): string => {
  const hrs = Math.floor(totalMins / 60).toString().padStart(2, "0");
  const mins = (totalMins % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}`;
};

slotGeneratorRouter.get("/slots", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (userRole !== "PROVIDER") return res.status(403).json({ message: "Forbidden" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true }
  });

  if (!user?.businessId) {
    return res.status(404).json({ message: "Business not found for this provider" });
  }

  const [services, availabilities] = await Promise.all([
    prisma.service.findMany({
      where: { businessId: user.businessId, isActive: true },
      select: { id: true, name: true, durationMin: true, bufferMin: true }
    }),
    prisma.availability.findMany({
      where: { userId: userId, businessId: user.businessId },
      select: { dayOfWeek: true, startTime: true, endTime: true }
    })
  ]);

  const schedule: Record<string, any> = {};

  // Generate slots for each day the provider is available
  availabilities.forEach((avail) => {
    const daySlots: any[] = [];
    
    services.forEach((service) => {
      let current = timeToMinutes(avail.startTime);
      const end = timeToMinutes(avail.endTime);
      const totalRequired = service.durationMin + service.bufferMin;

      const slotsForThisService = [];

      while (current + totalRequired <= end) {
        slotsForThisService.push({
          serviceName: service.name,
          start: minutesToTime(current),
          end: minutesToTime(current + service.durationMin),
          nextAvailable: minutesToTime(current + totalRequired)
        });
        // Interval: move forward by 15 or 30 minutes for the next possible start time
        current += totalRequired; 
      }
      
      daySlots.push({
        serviceId: service.id,
        serviceName: service.name,
        availableSlots: slotsForThisService
      });
    });

    schedule[avail.dayOfWeek] = daySlots;
  });

  return res.json({
    businessId: user.businessId,
    providerId: userId,
    schedule
  });
});