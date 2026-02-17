import { Router } from "express";
import {z} from 'zod';
import { prisma } from "../prisma";
import { UserRole } from "@prisma/client/wasm";
import { signAccessToken } from "../utils/jwt";
import { hashPassword, comparePassword} from "../utils/password";

export const authRouter = Router();
// Schema for user registration
const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string(),
  passwordHash: z.string().min(6),
  role: z.enum(['CUSTOMER', 'PROVIDER']).optional(),
});

authRouter.post("/profile", async (req, res) => {
  const validated = registerSchema.safeParse( req.body);
  if (!validated.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: z.treeifyError(validated.error),
    });
  }

    // check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    const { name, email, passwordHash, role } = validated.data;
    // hash the password 
    const hashedPassword = await hashPassword(passwordHash);

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword, role: role? (role as UserRole): UserRole.CUSTOMER },
      select: { id: true, name: true, email: true, role: true, createdAt: true  },
    });

// Assign the access token to the user
    const token =  signAccessToken({ userId: user.id, role: user.role });    
    res.json({ user, token });
});


// Schema for user login
const loginSchema = z.object({
  email: z.string(),
  passwordHash: z.string().min(6),
});

authRouter.post("/login", async (req, res) => {
  const validated = loginSchema.safeParse( req.body);
  if (!validated.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: z.treeifyError(validated.error),
    });
  }

    const { email, passwordHash } = validated.data;

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
          business: {
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
          },
        },
      });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await comparePassword(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Assign the access token to the user
    const token =  signAccessToken({ userId: user.id, role: user.role });    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        businessId: user.businessId,
        business: user.business,
      },
      token,
    });

});