import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await comparePassword(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signJwt(
    { userId: user.id, role: user.role, email: user.email },
    3600
  );
  res.json({ token });
}
