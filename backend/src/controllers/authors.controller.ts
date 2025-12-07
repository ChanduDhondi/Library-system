import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function listAuthors(req: Request, res: Response) {
  const authors = await prisma.author.findMany({ include: { books: true } });
  res.json(authors);
}

export async function createAuthor(req: Request, res: Response) {
  const { name, bio } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });
  const author = await prisma.author.create({ data: { name, bio } });
  res.status(201).json(author);
}

export async function updateAuthor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, bio } = req.body;
  const author = await prisma.author.update({
    where: { id },
    data: { name, bio },
  });
  res.json(author);
}

export async function deleteAuthor(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.author.delete({ where: { id } });
  res.json({ message: "Deleted" });
}
