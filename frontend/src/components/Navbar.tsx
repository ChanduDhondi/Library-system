import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/authContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  function hadleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">
            Library
          </Link>
          {token && (
            <Link to="/books" className="text-sm">
              Books
            </Link>
          )}
          {token && (
            <Link to="/authors" className="text-sm">
              Authors
            </Link>
          )}
          {token && (
            <Link to="/my-borrows" className="text-sm">
              My Borrows
            </Link>
          )}
        </div>
        <div>
          {token ? (
            <button onClick={hadleLogout} className="px-3 py-1 border rounded">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-3 py-1 border rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
