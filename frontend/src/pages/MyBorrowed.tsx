// import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export default function MyBorrowed() {
  // const [borrows, setBorrows] = useState<any[]>([]);

  const queryClient = useQueryClient();

  // async function load() {
  //   const token = localStorage.getItem("token");
  //   let userId: number | null = null;
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split(".")[1]));
  //       userId = payload.userId;
  //     } catch {
  //       console.log("Error in Load function");
  //     }
  //   }
  //   if (!userId) return setBorrows([]);
  //   const res = await api.get(`/borrows/user/${userId}`);
  //   setBorrows(res.data);
  // }

  // useEffect(() => {
  //   (async () => {
  //     await load();
  //   })();
  // }, []);

  // async function ret(borrowId: number) {
  //   await api.post("/borrows/return", { borrowId });
  //   load();
  // }

  const { data: borrows = [] } = useQuery({
    queryKey: ["borrows"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) return Promise.resolve([]);

      let userId: number | null = null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.userId;
      } catch {
        console.log("Error parsing token");
        return Promise.resolve([]);
      }

      if (!userId) return Promise.resolve([]);

      const res = await api.get(`/borrows/user/${userId}`);
      return res.data;
    },
    staleTime: 0, // 1 hour
  });

  const returnMutation = useMutation({
    mutationFn: async (borrowId: number) =>
      api.post("/borrows/return", { borrowId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  function ret(borrowId: number) {
    if (!borrowId) return;
    returnMutation.mutate(borrowId);
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">My Borrows</h2>
      <ul className="space-y-3">
        {borrows.map((b: any) => (
          <li
            key={b.id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <div>
              <div className="font-medium">{b.book.title}</div>
              <div className="text-sm text-gray-600">
                Borrowed at: {new Date(b.borrowedAt).toLocaleString()}
              </div>
              {b.returnedAt && (
                <div className="text-sm text-green-600">
                  Returned: {new Date(b.returnedAt).toLocaleString()}
                </div>
              )}
            </div>
            {!b.returnedAt && (
              <button
                className="px-3 py-1 bg-yellow-600 text-white rounded"
                onClick={() => ret(b.id)}
              >
                Return
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
