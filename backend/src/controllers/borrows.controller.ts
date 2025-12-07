import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function borrowBook(req: Request, res: Response) {
  const { bookId, userId } = req.body;

  if (!bookId) return res.status(400).json({ message: "bookId required" });

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
  });
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.copies <= 0)
    return res.status(400).json({ message: "No copies available" });

  const uid = userId || (req as any).user?.userId;
  if (!uid) return res.status(400).json({ message: "userId required" });

  const result = await prisma.$transaction(async (tx) => {
    const borrow = await tx.borrow.create({
      data: { bookId: Number(bookId), userId: Number(uid) },
    });

    await tx.book.update({
      where: { id: Number(bookId) },
      data: { copies: { decrement: 1 } }, // ⭐ decrease copies
    });

    return borrow;
  });

  res.status(201).json(result);
}

export async function returnBook(req: Request, res: Response) {
  const { borrowId } = req.body;
  if (!borrowId) return res.status(400).json({ message: "borrowId required" });

  const borrow = await prisma.borrow.findUnique({
    where: { id: Number(borrowId) },
  });

  if (!borrow) return res.status(404).json({ message: "Borrow not found" });
  if (borrow.returnedAt)
    return res.status(400).json({ message: "Already returned" });

  const result = await prisma.$transaction(async (tx) => {
    await tx.borrow.update({
      where: { id: Number(borrowId) },
      data: { returnedAt: new Date() },
    });

    await tx.book.update({
      where: { id: borrow.bookId },
      data: { copies: { increment: 1 } }, // ⭐ increase copies
    });
  });

  res.json({ message: "Returned successfully" });
}

export async function listUserBorrows(req: Request, res: Response) {
  const userIdParam = Number(req.params.userId);
  const userId = userIdParam || (req as any).user?.userId;
  if (!userId) return res.status(400).json({ message: "userId required" });
  const borrows = await prisma.borrow.findMany({
    where: { userId },
    include: { book: true },
  });
  res.json(borrows);
}
