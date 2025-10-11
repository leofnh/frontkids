import {
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  SquareUserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "./context";

export function Nav() {
  const { logout, userData } = useData() as {
    logout: () => void;
    userData: { username: string }[];
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-gradient-to-r from-brown-500 to-brown-600 backdrop-blur supports-[backdrop-filter]:bg-brown-500/95 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/caixa"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img
              src="https://i.imgur.com/1gjHoAF.png"
              className="h-10 w-auto md:h-12"
              alt="Logo Paula Kids"
            />
          </Link>
          <div className="hidden md:flex flex-col">
            <span className="text-sm text-brand-500 font-medium">
              Olá, {userData[0].username}!
            </span>
            <h1 className="text-lg font-bold text-brand-50 tracking-tight">
              Loja Paula Kids
            </h1>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/vendas/site"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-brand-500/20 hover:text-brand-100 transition-all duration-200 font-medium"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden lg:inline text-sm">Site</span>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-brand-500/20 hover:text-brand-100 transition-all duration-200 font-medium"
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden lg:inline text-sm">Dashboard</span>
            </Link>

            <Link
              to="/clientes"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-brand-500/20 hover:text-brand-100 transition-all duration-200 font-medium"
            >
              <SquareUserRound className="size-4" />
              <span className="hidden lg:inline text-sm">Clientes</span>
            </Link>

            <Link
              to="/produtos"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-brand-500/20 hover:text-brand-100 transition-all duration-200 font-medium"
            >
              <Package className="size-4" />
              <span className="hidden lg:inline text-sm">Produtos</span>
            </Link>

            <Link
              to="/caixa"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-brand-500/20 hover:text-brand-100 transition-all duration-200 font-medium"
            >
              <DollarSign className="size-4" />
              <span className="hidden lg:inline text-sm">Caixa</span>
            </Link>
          </div>

          {/* Mobile Menu Button - pode ser implementado futuramente */}
          <div className="md:hidden">
            {/* Aqui pode ser adicionado um menu mobile */}
          </div>

          <div className="flex items-center ml-2">
            <button
              onClick={logout}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-brand-50 hover:bg-red-500/20 hover:text-red-100 transition-all duration-300 font-medium border border-transparent hover:border-red-400/30 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon with Animation */}
              <LogOut className="size-4 relative z-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />

              {/* Text */}
              <span className="hidden sm:inline text-sm relative z-10 font-medium">
                Sair
              </span>

              {/* Pulse Effect on Hover */}
              <div className="absolute inset-0 rounded-lg bg-red-400/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-50"></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
