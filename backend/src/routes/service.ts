import { Router } from "express";
import { prisma } from "../prisma";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const serviceRouter = Router();

serviceRouter.get("/service", authMiddleware, async (req:AuthRequest, res) => {
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

    const services = await prisma.service.findMany({
    where: { businessId: user.businessId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      durationMin: true,
      bufferMin: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
    return res.json(services)
})

serviceRouter.post("/services", authMiddleware, async(req:AuthRequest, res) => {
  const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) return res.status(401).json({message: "Unauthorized"});
    if (userRole !== "PROVIDER") return res.status(403).json({message: "Forbidden: Only employees can access this endpoint"})
  
    const { name, durationMin, bufferMin, isActive } = req.body;
    if (!name || !durationMin) {
        return res.status(400).json({message: "name and durationMin are required"})
    }
    if (durationMin <= 0 || bufferMin < 0 ) {
        return res.status(400).json({message: "durationMin must be greater than 0"})
    }

    const user = await prisma.user.findUnique({
        where : {id: userId},
        select: {businessId: true}  
    })
    if(!user?.businessId){
        return res.status(404).json({message: "This Employee dose not have any business create a business first"})
    }

    const service = await prisma.service.create({
        data: {
            name,
            durationMin,
            bufferMin: bufferMin || 0,
            isActive: isActive ?? true,
            businessId: user.businessId
        },
        select: {
            id: true,
            name: true,
            durationMin: true,
            bufferMin: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return res.status(201).json(service)
})

