import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hashPassword } from "../utils/hash";

export async function listUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });
  res.status(201).json({ id: user.id, email: user.email, name: user.name });
}
