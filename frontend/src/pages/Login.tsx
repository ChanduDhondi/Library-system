import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { useContext } from "react";
import AuthContext from "../contexts/authContext";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("adminpass");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/books");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-indigo-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
