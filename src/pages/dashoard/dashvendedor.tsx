import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useData } from "../../components/context";
import { ModalCreateFunc } from "./modalCreateFunc";
import {
  Search,
  UserPlus,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  ChevronLeft,
  ChevronRight,
  Hash,
  X,
} from "lucide-react";

interface Vendedor {
  id: number;
  username: string;
  venda_anterior: number;
  venda_atual: number;
}

interface iCard {
  title: string;
  description: string;
  data: Vendedor[];
  notifyError: (text: string) => void;
  notifySuccess: (text: string) => void;
}

export const CardDashVendedor: React.FC<iCard> = ({
  title,
  description,
  data,
}) => {
  const { formatedMoney } = useData() as {
    formatedMoney: (value: number) => string;
  };
  const [isCreateFunc, setCreateFunc] = useState(false);

  const header = [
    { key: "id", label: "ID", icon: Hash },
    { key: "username", label: "Vendedor", icon: Users },
    { key: "venda_anterior", label: "Mês Anterior", icon: DollarSign },
    { key: "venda_atual", label: "Mês Atual", icon: TrendingUp },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Filtrar dados com base no termo de busca
  useEffect(() => {
    const searchData = data.filter(
      (item: Vendedor) =>
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
    );
    setFilteredData(searchData);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Reset para página 1 quando items per page muda
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Garantir que currentPage não exceda totalPages
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  const currentData = filteredData.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Gerar números de página para navegação
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, safePage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <Card className="bg-white border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg">
                <Award className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-brown-800 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {title}
                </CardTitle>
                <CardDescription className="text-brown-600 mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            <Button
              className="bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2 px-4 py-2"
              onClick={() => setCreateFunc(!isCreateFunc)}
            >
              <UserPlus className="h-4 w-4" />
              Criar Vendedor
            </Button>
          </div>
          <div className="text-sm text-brown-600 bg-brand-100 px-3 py-1 rounded-full w-fit mt-2">
            {filteredData.length} vendedor
            {filteredData.length !== 1 ? "es" : ""} encontrado
            {filteredData.length !== 1 ? "s" : ""}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Barra de pesquisa e controles */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Pesquisar pelo nome do vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border-brand-200 text-brown-800 placeholder-brown-400 focus:border-brand-400 focus:ring-brand-200"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-brown-600 whitespace-nowrap">
                Itens por página:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white border border-brand-200 text-brown-800 rounded-md px-3 py-1 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto border border-brand-200 rounded-lg">
            <Table className="bg-white">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-brand-200">
                  {header.map((col, index) => {
                    const IconComponent = col.icon;
                    return (
                      <TableHead
                        key={index}
                        className={`text-brown-700 font-semibold bg-brand-50/50 py-4 ${
                          col.key === "username" ? "text-left" : "text-center"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            col.key === "username"
                              ? "justify-start"
                              : "justify-center"
                          }`}
                        >
                          <IconComponent className="h-4 w-4 text-brand-600" />
                          {col.label}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((item: Vendedor, index) => (
                    <TableRow
                      key={index}
                      className="text-center hover:bg-brand-50 transition-colors border-b border-brand-100"
                    >
                      <TableCell className="py-4 text-brown-800 font-medium">
                        <div className="flex items-center justify-center">
                          <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded-full text-xs font-semibold">
                            #{item.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-brown-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {item.username?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium">{item.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-brown-800">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="h-4 w-4 text-brown-500" />
                          <span className="font-mono">
                            {formatedMoney(item.venda_anterior)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-brown-800">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-4 w-4 text-brand-600" />
                          <span className="font-mono font-semibold text-brand-700">
                            {formatedMoney(item.venda_atual)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={header.length}
                      className="text-center py-8 text-brown-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Target className="h-8 w-8 text-brown-300" />
                        {searchTerm
                          ? "Nenhum vendedor encontrado com os critérios de pesquisa."
                          : "Nenhum vendedor cadastrado."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação melhorada */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="text-sm text-brown-600">
                Mostrando {(safePage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(safePage * itemsPerPage, filteredData.length)} de{" "}
                {filteredData.length} vendedores
              </div>

              <div className="flex items-center gap-2 px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={safePage === 1}
                  className="min-w-[70px] text-xs text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  Primeira
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="min-w-[70px] text-xs text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === safePage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={`min-w-[32px] text-xs ${
                        pageNum === safePage
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : "text-brown-700 hover:bg-brand-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="min-w-[70px] text-xs text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="min-w-[70px] text-xs text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  Última
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {isCreateFunc && (
        <ModalCreateFunc
          titleModal="Criando Funcionários"
          descriptionModal="Preencha os dados corretamente."
          isOpen={isCreateFunc}
          closeModal={() => setCreateFunc(false)}
        ></ModalCreateFunc>
      )}
    </>
  );
};
