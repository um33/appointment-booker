import { Router } from "express";
import { prisma } from "../prisma";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const businessRouter = Router();

// GET business details for the authenticated provider
businessRouter.get("/business", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (userRole !== "PROVIDER") {
    return res.status(403).json({ message: "Forbidden: Only providers can access this endpoint" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user?.businessId) {
    return res.status(404).json({ message: "Business not found for this provider" });
  }

  const business = await prisma.business.findUnique({
    where: { id: user.businessId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(business);
});

// POST create business profile for provider (only once)
businessRouter.post("/business", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (userRole !== "PROVIDER") {
    return res.status(403).json({ message: "Forbidden: Only providers can access this endpoint" });
  }

  const { name, slug, logoUrl, primaryColor, secondaryColor } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "name and slug are required" });
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (existing?.businessId) {
    return res.status(409).json({ message: "Business already exists for this user" });
  }

  try {
    const business = await prisma.$transaction(async (tx) => {
      const created = await tx.business.create({
        data: {
          name,
          slug,
            timezone: "Europe/Stockholm",
          logoUrl,
          primaryColor,
          secondaryColor,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          primaryColor: true,
          secondaryColor: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { businessId: created.id },
      });

      return created;
    });

    return res.status(201).json(business);
  } catch (error: any) {
    // Unique constraint error (slug already exists)
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Slug already in use" });
    }
    console.error("Error creating business:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
