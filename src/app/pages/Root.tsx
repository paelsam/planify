import { useEffect } from "react";
import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router";
import {
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Tag,
  Github,
} from "lucide-react";
import { getUser, logout } from "../utils/storage";
import { toast } from "sonner";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-gray-100 text-black border-b-4 border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* App Logo */}
            

            <div className="flex items-center gap-3">
              <div
                className="bg-white border-2 border-black p-2"
                style={{ boxShadow: "4px 4px 0px 0px #000000" }}
              >
                <User className="text-black" size={20} />
              </div>
              <div>
                <p className="font-black text-sm">
                  {user.name}
                </p>
                <p className="text-xs opacity-80">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2 ml-8">
              <Link
                to="/"
                className={`px-4 py-2 font-black text-sm uppercase border-2 border-black flex items-center gap-2 ${
                  isActive("/")
                    ? "bg-black text-white"
                    : "hover:bg-white"
                }`}
                style={{ boxShadow: "3px 3px 0px 0px #000000" }}
              >
                <LayoutDashboard size={16} />
                Panel
              </Link>
              <Link
                to="/sesiones"
                className={`px-4 py-2 font-black text-sm uppercase border-2 border-black flex items-center gap-2 ${
                  isActive("/sesiones")
                    ? "bg-black text-white"
                    : "hover:bg-white"
                }`}
                style={{ boxShadow: "3px 3px 0px 0px #000000" }}
              >
                <Calendar size={16} />
                Sesiones
              </Link>
              <Link
                to="/categorias"
                className={`px-4 py-2 font-black text-sm uppercase border-2 border-black flex items-center gap-2 ${
                  isActive("/categorias")
                    ? "bg-black text-white"
                    : "hover:bg-white"
                }`}
                style={{ boxShadow: "3px 3px 0px 0px #000000" }}
              >
                <Tag size={16} />
                Categorías
              </Link>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-black border-2 border-black px-4 py-2 font-black text-sm uppercase hover:bg-gray-200 flex items-center gap-2"
            style={{ boxShadow: "3px 3px 0px 0px #000000" }}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-black text-white border-b-4 border-black">
        <div className="flex">
          <Link
            to="/"
            className={`flex-1 py-3 font-black text-sm uppercase text-center border-r-2 border-white flex items-center justify-center gap-2 ${
              isActive("/") ? "bg-white text-black" : ""
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            to="/sesiones"
            className={`flex-1 py-3 font-black text-sm uppercase text-center border-r-2 border-white flex items-center justify-center gap-2 ${
              isActive("/sesiones") ? "bg-white text-black" : ""
            }`}
          >
            <Calendar size={16} />
            Sesiones
          </Link>
          <Link
            to="/categorias"
            className={`flex-1 py-3 font-black text-sm uppercase text-center flex items-center justify-center gap-2 ${
              isActive("/categorias")
                ? "bg-white text-black"
                : ""
            }`}
          >
            <Tag size={16} />
            Categorías
          </Link>
        </div>
      </div>

      <Outlet />

      {/* Footer */}
      <footer className="bg-gray-100 border-t-4 border-black p-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <a
            href="https://github.com/paelsam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border-4 border-black px-6 py-3 font-black uppercase hover:bg-gray-200 transition-colors"
            style={{ boxShadow: "4px 4px 0px 0px #000000" }}
          >
            <Github size={24} strokeWidth={3} />
            <span>@paelsam</span>
          </a>
        </div>
      </footer>
    </div>
  );
}