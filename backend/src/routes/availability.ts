import {Router } from "express";
import { prisma } from "../prisma";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const availabilityRouter = Router();

availabilityRouter.get("/availability", authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) return res.status(401).json({message: "Unauthorized"});
    if (userRole !== "PROVIDER") return res.status(403).json({message: "Forbidden: Only employees can access this endpoint"})

    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {businessId: true}
    })

    if(!user?.businessId){
        return res.status(404).json({message: "This Employee dose not have any business"})
    }
    const availability = await prisma.availability.findMany({
        where: { userId: userId, businessId: user.businessId },
        select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return res.json(availability)
})


availabilityRouter.post("/availability", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (userRole !== "PROVIDER") {
    return res.status(403).json({ message: "Forbidden: Only providers can access this endpoint" });
  }

  const { dayOfWeek, startTime, endTime } = req.body;

  if (!dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ message: "dayOfWeek, startTime, and endTime are required" });
  }


  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user?.businessId) {
    return res.status(400).json({ message: "Create a business first" });
  }

  try {
    const service = await prisma.availability.create({
      data: {
        businessId: user.businessId,
        userId: userId,
        dayOfWeek,
        startTime,
        endTime,
      },
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(service);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ message: "Service name already exists for this business" });
    }
    console.error("Create service error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
