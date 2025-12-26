import jwt from "jsonwebtoken";

type JwtUser = { userId: string; role: string };

export function signAccessToken(payload: JwtUser) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = Number(process.env.JWT_EXPIRES_IN);

  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.verify(token, secret) as JwtUser;
}
