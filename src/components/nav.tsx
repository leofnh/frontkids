import {
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  SquareUserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useData } from "./context";

export function Nav() {
  const { logout, userData } = useData() as {
    logout: () => void;
    userData: { username: string }[];
  };
  return (
    <header className="w-full h-auto mt-3 border-b border-app-text-color px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between bg-app-bg-color">
      <div className="flex items-center">
        <Link to="/caixa">
          <img
            src="https://i.imgur.com/1gjHoAF.png"
            className="w-[104px] h-auto"
            alt="Logo Paula Kids"
          />
        </Link>
        <div className="hidden md:flex flex-col justify-start items-start ml-8 font-bold">
          <h3 className="text-base text-app-text-color">
            Olá, {userData[0].username.toUpperCase()} !
          </h3>
          <h1 className="text-2xl text-app-text-color">Loja Paula Kids</h1>
        </div>
      </div>
      <nav className="flex items-center gap-4">
        <div className="text-xl flex items-center gap-1">
          <Link
            to="/vendas/site"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200/60 transition-colors"
          >
            <ShoppingBag className="size-5" />
            <span className="hidden lg:inline">Site</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200/60 transition-colors"
          >
            <LayoutDashboard className="size-5" />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>

          <Link
            to="/clientes"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200/60 transition-colors"
          >
            <SquareUserRound className="size-5" />
            <span className="hidden lg:inline">Clientes</span>
          </Link>
          <Link
            to="/produtos"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200/60 transition-colors"
          >
            <Package className="size-5" />
            <span className="hidden lg:inline">Produtos</span>
          </Link>
          <Link
            to="/caixa"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200/60 transition-colors"
          >
            <DollarSign className="size-5" />
            <span className="hidden lg:inline">Caixa</span>
          </Link>
        </div>

        <div className="cursor-pointer flex items-center">
          <Button
            className="bg-red-500 gap-2 hover:bg-red-600"
            onClick={logout}
            size="sm"
          >
            <LogOut size="18" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
