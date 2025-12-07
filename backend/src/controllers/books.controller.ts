import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function listBooks(req: Request, res: Response) {
  const {
    authorId,
    search,
    available,
    page = "1",
    limit = "10",
  } = req.query as any;
  const where: any = {};
  if (authorId) where.authorId = Number(authorId);
  if (search) where.title = { contains: String(search), mode: "insensitive" };

  const take = Math.min(100, Number(limit) || 10);
  const skip = (Number(page) - 1) * take;

  const books = await prisma.book.findMany({
    where,
    include: { author: true, borrows: true },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  if (available !== undefined) {
    const availBool = String(available) === "true";
    const filtered = books.filter((b) =>
      availBool ? b.copies > 0 : b.copies === 0
    );
    return res.json(filtered);
  }

  res.json(books);
}

export async function getBook(req: Request, res: Response) {
  const id = Number(req.params.id);
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true, borrows: true },
  });
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
}

export async function createBook(req: Request, res: Response) {
  const { title, description, authorId, copies } = req.body;
  if (!title || !authorId)
    return res.status(400).json({ message: "Missing fields" });
  const book = await prisma.book.create({
    data: {
      title,
      description,
      authorId: Number(authorId),
      copies: Number(copies) || 1,
    },
  });
  res.status(201).json(book);
}

export async function updateBook(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, description, authorId, copies } = req.body;
  const data: any = {};
  if (title) data.title = title;
  if (description) data.description = description;
  if (authorId) data.authorId = Number(authorId);
  if (copies !== undefined) data.copies = Number(copies);
  const book = await prisma.book.update({ where: { id }, data });
  res.json(book);
}

export async function deleteBook(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.book.delete({ where: { id } });
  res.json({ message: "Deleted" });
}
