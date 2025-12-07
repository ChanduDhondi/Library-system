import React, { useState } from "react";
import api from "../api/apiClient";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

type Author = { id: number; name: string; bio?: string };

export default function Authors() {
  // const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const queryClient = useQueryClient();

  // async function load() {
  //   const res = await api.get("/authors");
  //   setAuthors(res.data);
  // }

  // useEffect(() => {
  //   (async () => {
  //     await load();
  //   })();
  // }, []);

  // async function createAuthor(e: React.FormEvent) {
  //   e.preventDefault();
  //   await api.post("/authors", { name, bio });
  //   setName("");
  //   setBio("");
  //   load();
  // }

  // async function del(id: number) {
  //   if (!confirm("Delete author?")) return;
  //   await api.delete(`/authors/${id}`);
  //   load();
  // }

  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await api.get("/authors");
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const createAuthorMutation = useMutation({
    mutationFn: async () => api.post("/authors", { name, bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setName("");
      setBio("");
    },
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/authors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  function createAuthor(e: React.FormEvent) {
    e.preventDefault();
    createAuthorMutation.mutate();
  }

  function del(id: number) {
    if (!confirm("Delete author?")) return;
    deleteAuthorMutation.mutate(id);
  }

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mb-4">Authors</h2>
        <ul className="space-y-2">
          {authors.map((a: Author) => (
            <li
              key={a.id}
              className="bg-white p-3 rounded shadow flex justify-between"
            >
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">{a.bio}</div>
              </div>
              <button className="text-red-600" onClick={() => del(a.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ADD AUTHOR FORM */}
      <div>
        <h3 className="font-semibold mb-2">Add Author</h3>
        <form
          onSubmit={createAuthor}
          className="space-y-2 bg-white p-4 rounded shadow"
        >
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
          <button className="w-full bg-green-600 text-white p-2 rounded">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
