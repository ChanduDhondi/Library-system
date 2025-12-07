import React, { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/apiClient";

type Book = {
  id: number;
  title: string;
  description?: string;
  copies: number;
  author: any;
};

export default function Books() {
  // const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState<number | "">("");
  const [copies, setCopies] = useState(1);
  // const [authors, setAuthors] = useState([]);

  const queryClient = useQueryClient();

  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.get("/books");
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await api.get("/authors");
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const createBookMutation = useMutation({
    mutationFn: async () => api.post("/books", { title, authorId, copies }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setTitle("");
      setAuthorId("");
      setCopies(1);
    },
  });

  function createBook(e: React.FormEvent) {
    e.preventDefault();
    createBookMutation.mutate();
  }

  // async function borrow(bookId: number) {
  //   try {
  //     await api.post("/borrows", { bookId });
  //     alert("Borrowed");
  //     load();
  //   } catch (err: any) {
  //     alert(err?.response?.data?.message || "Error");
  //   }
  // }

  const borrowMutation = useMutation({
    mutationFn: async (bookId: number) => {
      return api.post("/borrows", { bookId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  function borrow(bookId: number) {
    borrowMutation.mutate(bookId);
  }

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mb-4">Books</h2>
        <ul className="space-y-3">
          {books.map((b: Book) => (
            <li
              key={b.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {b.title}{" "}
                  <span className="text-sm text-gray-500">
                    by {b.author?.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{b.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">Copies: {b.copies}</div>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => borrow(b.id)}
                >
                  Borrow
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Add Book</h3>
        <form
          onSubmit={createBook}
          className="space-y-2 bg-white p-4 rounded shadow"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          <select
            value={authorId}
            onChange={(e) => setAuthorId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Select author</option>
            {authors.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-green-600 text-white p-2 rounded">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}
