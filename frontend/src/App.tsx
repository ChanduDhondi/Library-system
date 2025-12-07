import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Authors from "./pages/Authors";
import Books from "./pages/Books";
import MyBorrowed from "./pages/MyBorrowed";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }: any) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/authors"
            element={
              <PrivateRoute>
                <Authors />
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-borrows"
            element={
              <PrivateRoute>
                <MyBorrowed />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/books" replace />} />
        </Routes>
      </div>
    </div>
  );
}
