import express from 'express';
import dotenv from 'dotenv';
import { prisma } from './prisma';

dotenv.config();

const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.get("/health", async (_req, res) => {
  // Simple DB check
  await prisma.user.count();
  res.json({ ok: true, service: "appointment-booker-api", db: "connected" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});