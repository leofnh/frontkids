import {
  Check,
  RefreshCcw,
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useState, useEffect } from "react";
import { ImgProductType, ProductFormData } from "../../components/types";

interface ProductTable {
  marca: string;
  codigo: string;
  ref?: string;
  produto?: string;
  estoque?: string | number;
  preco?: string | number;
  [key: string]: string | number | undefined;
}

interface iCard {
  dataHeader: Array<string>;
  imgProduct: ImgProductType[];
  setImgProduct: React.Dispatch<React.SetStateAction<ImgProductType[]>>;
  dataBody: ProductTable[];
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
  handleUpdate: (
    valueCodigo: string,
    formatedValue: number,
    produto: string
  ) => void;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDataUpdate: React.Dispatch<React.SetStateAction<ProductFormData>>;
  isImgOpen: boolean;
  setImgOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TableBaseProduct: React.FC<iCard> = ({
  dataHeader,
  dataBody,
  setImgOpen,
  notifyError,
  notifySuccess,
  handleUpdate,
  setUpdate,
  setIsOpen,
  setDataUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputProduct, setInputProduct] = useState<string>("");

  // Reset para página 1 quando o termo de pesquisa muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset para página 1 quando items per page muda
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const enviarCodigo = (codigo: string) => {
    const formatedValue = parseInt(inputValue);
    if (formatedValue >= 0) {
      handleUpdate(codigo, formatedValue, inputProduct);
      notifySuccess("Estoque atualizado com sucesso!");
      setEditIndex(null);
      setInputValue("");
      setInputProduct("");
    } else {
      notifyError(
        "O estoque não pode ser atualizado, verifique se preencheu o valor corretamente."
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputProduct(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredData = dataBody.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const searchInMarca = item.marca?.toLowerCase().includes(searchLower);
    const searchInCode = item.codigo?.toLowerCase().includes(searchLower);
    const searchInRef = item.ref?.toLowerCase().includes(searchLower);
    const searchInProduct = item.produto?.toLowerCase().includes(searchLower);

    return searchInMarca || searchInCode || searchInRef || searchInProduct;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Garantir que currentPage não exceda totalPages
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

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
            Produtos Cadastrados
          </CardTitle>
          <div className="text-sm text-brown-600 bg-brand-100 px-3 py-1 rounded-full">
            {filteredData.length} produto{filteredData.length !== 1 ? "s" : ""}{" "}
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
              placeholder="Pesquisar por marca, código, ref ou produto..."
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
                        {item[header.toLowerCase()]}
                      </TableCell>
                    ))}
                    <TableCell className="py-4">
                      {editIndex === index ? (
                        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
                          <Input
                            className="text-brown-800 text-sm w-32 border-brand-200 focus:border-brand-400"
                            value={inputProduct}
                            onChange={handleInputProductChange}
                            placeholder="Nome do produto"
                          />
                          <Input
                            className="text-brown-800 text-sm w-24 border-brand-200 focus:border-brand-400"
                            type="number"
                            value={inputValue}
                            placeholder="Estoque"
                            onChange={handleInputChange}
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 rounded-md"
                              onClick={() => enviarCodigo(item.codigo)}
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-md"
                              onClick={() => setEditIndex(null)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-brand-600 hover:text-brand-700 hover:bg-brand-100 p-2 rounded-md"
                            onClick={() => {
                              setUpdate(true);
                              setIsOpen(true);
                              setDataUpdate({
                                ref: item.ref || "",
                                loja: true,
                                marca: item.marca || "",
                                codigo: item.codigo || "",
                                tamanho: "", // ProductGroup doesn't have tamanho directly
                                preco: item.preco?.toString() || "0",
                                custo: "0", // ProductGroup doesn't have custo
                                estoque:
                                  typeof item.estoque === "number"
                                    ? item.estoque
                                    : parseInt(item.estoque?.toString() || "0"),
                                produto: item.produto || "",
                                cor: "", // ProductGroup doesn't have cor directly
                                descricao:
                                  typeof item.descricao === "string"
                                    ? item.descricao
                                    : item.descricao?.toString() || "",
                                sequencia:
                                  typeof item.sequencia === "number"
                                    ? item.sequencia
                                    : parseInt(
                                        item.sequencia?.toString() || "0"
                                      ),
                                id:
                                  typeof item.id === "number"
                                    ? item.id
                                    : undefined,
                                update:
                                  typeof item.update === "string"
                                    ? item.update
                                    : undefined,
                              });
                            }}
                            title="Editar produto"
                          >
                            <RefreshCcw size={16} />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 p-2 rounded-md"
                            onClick={() => {
                              setImgOpen(true);
                              setDataUpdate({
                                ref: item.ref || "",
                                loja: true,
                                marca: item.marca || "",
                                codigo: item.codigo || "",
                                tamanho: "",
                                preco: item.preco?.toString() || "0",
                                custo: "0",
                                estoque:
                                  typeof item.estoque === "number"
                                    ? item.estoque
                                    : parseInt(item.estoque?.toString() || "0"),
                                produto: item.produto || "",
                                cor: "",
                                descricao:
                                  typeof item.descricao === "string"
                                    ? item.descricao
                                    : item.descricao?.toString() || "",
                                sequencia:
                                  typeof item.sequencia === "number"
                                    ? item.sequencia
                                    : parseInt(
                                        item.sequencia?.toString() || "0"
                                      ),
                                id:
                                  typeof item.id === "number"
                                    ? item.id
                                    : undefined,
                                update:
                                  typeof item.update === "string"
                                    ? item.update
                                    : undefined,
                              });
                            }}
                            title="Adicionar imagem"
                          >
                            <Image size={16} />
                          </Button>
                        </div>
                      )}
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
                      ? "Nenhum produto encontrado com os critérios de pesquisa."
                      : "Nenhum produto cadastrado."}
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
              {filteredData.length} produtos
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
