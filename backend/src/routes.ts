import { Router } from "express";
import * as authCtrl from "./controllers/auth.controller";
import * as authorsCtrl from "./controllers/authors.controller";
import * as booksCtrl from "./controllers/books.controller";
import * as usersCtrl from "./controllers/users.controller";
import * as borrowsCtrl from "./controllers/borrows.controller";
import { authMiddleware } from "./middlewares/auth.middleware";

const router = Router();

// Auth
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);

// Users
router.post("/users", usersCtrl.createUser);
router.get("/users", authMiddleware, usersCtrl.listUsers);

// Authors
router.get("/authors", authorsCtrl.listAuthors);
router.post("/authors", authMiddleware, authorsCtrl.createAuthor);
router.put("/authors/:id", authMiddleware, authorsCtrl.updateAuthor);
router.delete("/authors/:id", authMiddleware, authorsCtrl.deleteAuthor);

// Books
router.get("/books", booksCtrl.listBooks);
router.get("/books/:id", booksCtrl.getBook);
router.post("/books", authMiddleware, booksCtrl.createBook);
router.put("/books/:id", authMiddleware, booksCtrl.updateBook);
router.delete("/books/:id", authMiddleware, booksCtrl.deleteBook);

// Borrows
router.post("/borrows", authMiddleware, borrowsCtrl.borrowBook);
router.post("/borrows/return", authMiddleware, borrowsCtrl.returnBook);
router.get(
  "/borrows/user/:userId",
  authMiddleware,
  borrowsCtrl.listUserBorrows
);

export default router;
