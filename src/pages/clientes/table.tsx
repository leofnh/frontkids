import { useState, useEffect } from "react";
import { RefreshCcw, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { DataCliente } from "../../components/types";

interface iCard {
  dataHeader: Array<keyof DataCliente>;
  dataBody: DataCliente[];
  setDataUpdate: (data: DataCliente) => void;
  setCreateObject: (value: boolean) => void;
  setIsUpdate: (value: boolean) => void;
}

export const TableBaseClient: React.FC<iCard> = ({
  dataHeader,
  dataBody,
  setDataUpdate,
  setCreateObject,
  setIsUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Reset para página 1 quando o termo de pesquisa muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset para página 1 quando items per page muda
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Função para filtrar dados com base no termo de pesquisa
  const filteredData = dataBody.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const searchInName = item.nome?.toLowerCase().includes(searchLower);
    const searchInCpf = item.cpf?.toLowerCase().includes(searchLower);
    const searchInIdent = item.idt?.toLowerCase().includes(searchLower);
    const searchInTelefone = item.telefone?.toLowerCase().includes(searchLower);

    return searchInName || searchInCpf || searchInIdent || searchInTelefone;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Garantir que currentPage não exceda totalPages
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  // Função para calcular os dados exibidos na página atual
  const paginatedData = filteredData.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="bg-white border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-brown-800">
            Clientes Cadastrados
          </CardTitle>
          <div className="text-sm text-brown-600 bg-brand-100 px-3 py-1 rounded-full">
            {filteredData.length} cliente{filteredData.length !== 1 ? "s" : ""}{" "}
            encontrado{filteredData.length !== 1 ? "s" : ""}
          </div>
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
              placeholder="Pesquisar por nome, CPF, identidade ou telefone..."
              value={searchTerm}
              onChange={handleSearchChange}
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
                {dataHeader.map((header, index) => (
                  <TableHead
                    className="text-center text-brown-700 font-semibold bg-brand-50/50 py-4"
                    key={index}
                  >
                    {header.toUpperCase()}
                  </TableHead>
                ))}
                <TableHead className="text-center text-brown-700 font-semibold bg-brand-50/50 py-4">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={index}
                    className="text-center hover:bg-brand-50 transition-colors border-b border-brand-100"
                  >
                    {dataHeader.map((header, idx) => (
                      <TableCell key={idx} className="py-4 text-brown-800">
                        {item[header]}
                      </TableCell>
                    ))}
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-brand-600 hover:text-brand-700 hover:bg-brand-100 p-2"
                          onClick={() => {
                            setDataUpdate(item);
                            setIsUpdate(true);
                            setCreateObject(true);
                          }}
                          title="Editar cliente"
                        >
                          <RefreshCcw size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={dataHeader.length + 1}
                    className="text-center py-8 text-brown-500"
                  >
                    {searchTerm
                      ? "Nenhum cliente encontrado com os critérios de pesquisa."
                      : "Nenhum cliente cadastrado."}
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
              {filteredData.length} clientes
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={safePage === 1}
                className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
              >
                Primeira
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
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
                    className={`min-w-[32px] ${
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
                className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={safePage === totalPages}
                className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
              >
                Última
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
