import {
  Banknote,
  Search,
  User,
  Package,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  FileText,
  TrendingUp,
  Eye,
} from "lucide-react";
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
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ModalConfirmVendaNota } from "./modalConfirm";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useData } from "../../components/context";
import { TypeCurrent } from "../../components/types";

interface iCard {
  title: string;
  description: string;
  data: TypeCurrent[];
  notifyError: (text: string) => void;
  notifySuccess: (text: string) => void;
}

export const CardDash: React.FC<iCard> = ({
  title,
  description,
  data,
  notifyError,
  notifySuccess,
}) => {
  const { setDashboard, formatedMoney } = useData() as {
    setDashboard: (fn: (prev: unknown) => unknown) => void;
    formatedMoney: (value: number) => string;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [dataNota, setDataNota] = useState<TypeCurrent | undefined>();
  const openCloseModal = (item?: TypeCurrent) => {
    setDataNota(item);
    setIsOpen(!isOpen);
  };

  const header = [
    { label: "Cliente", icon: User },
    { label: "Produto", icon: Package },
    { label: "Vencimento", icon: Calendar },
    { label: "Valor", icon: DollarSign },
    { label: "Status", icon: CheckCircle },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Filtrar dados e gerenciar paginação
  useEffect(() => {
    const searchData = data.filter((item) =>
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(searchData);

    // Só reseta a página se foi por mudança no termo de busca
    const previousDataLength = filteredData.length;
    const newDataLength = searchData.length;

    // Se o termo de busca mudou, resetar para página 1
    if (searchTerm !== "" && previousDataLength !== newDataLength) {
      setCurrentPage(1);
    } else {
      // Se os dados mudaram (ex: após confirmar pagamento), manter página atual
      // mas verificar se ainda é válida
      const newTotalPages = Math.ceil(searchData.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  }, [data, searchTerm, currentPage, filteredData.length]);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const sendFinish = async (data: TypeCurrent) => {
    try {
      const response = await toast.promise(api.put("api/venda/", data), {
        pending: {
          render: "Registrando notinha...",
          autoClose: 10,
        },
        success: {
          render: "Dados enviado com sucesso!",
          autoClose: 10,
        },
        error: {
          render: "Erro ao enviar os dados...",
          autoClose: 100,
        },
      });
      const dataResp = response.data;
      const status = dataResp["status"];
      const alert = dataResp["msg"];
      if (status == "sucesso") {
        const newDados = dataResp["dados"];
        setDashboard((prevDash: any) => ({
          ...prevDash,
          notinha: newDados,
        }));
        notifySuccess(alert);
      } else {
        notifyError(alert);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Card className="h-full border-brand-200 shadow-sm flex flex-col">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg">
                <FileText className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-brown-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {title}
                </CardTitle>
                <CardDescription className="text-brown-600 mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-brown-600 bg-brand-100 px-2 py-1 rounded-full">
                {filteredData.length} nota{filteredData.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 h-[520px]">
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Pesquisar pelo nome do cliente..."
                className="pl-10 pr-10 border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto border border-brand-200 rounded-lg">
            <div className="min-w-full overflow-x-auto">
              <Table className="bg-white w-full min-w-[800px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-brand-200">
                    {header.map((col, index) => {
                      const IconComponent = col.icon;
                      return (
                        <TableHead
                          key={index}
                          className="text-brown-700 font-semibold bg-brand-50/50 py-3 whitespace-nowrap min-w-[120px]"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-brand-600 flex-shrink-0" />
                            <span className="truncate">
                              {col.label.toUpperCase()}
                            </span>
                          </div>
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-brown-700 font-semibold bg-brand-50/50 py-3 whitespace-nowrap min-w-[80px]">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-brand-600 flex-shrink-0" />
                        <span className="truncate">AÇÕES</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => {
                      const isVencido = new Date(item.vencimento) < new Date();
                      const capitalizeFirstLetter = (string: string) => {
                        return (
                          string.charAt(0).toUpperCase() +
                          string.slice(1).toLowerCase()
                        );
                      };
                      const statusText = isVencido
                        ? "Vencido"
                        : capitalizeFirstLetter(item.status);
                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-brand-50 transition-colors border-b border-brand-100"
                        >
                          <TableCell className="py-3 text-brown-800 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {item.cliente?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <span className="font-medium truncate">
                                {item.cliente}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-brown-800 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-brown-500 flex-shrink-0" />
                              <span className="truncate">{item.produto}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-brown-800 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              {isVencido ? (
                                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              ) : (
                                <Clock className="h-4 w-4 text-brand-500 flex-shrink-0" />
                              )}
                              <span
                                className={`whitespace-nowrap ${
                                  isVencido ? "text-red-600 font-medium" : ""
                                }`}
                              >
                                {new Date(item.vencimento).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-brown-800 min-w-[100px]">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="font-mono font-semibold text-green-700 whitespace-nowrap">
                                {formatedMoney(item.valor)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 min-w-[90px]">
                            <Badge
                              className={`flex items-center gap-1 whitespace-nowrap ${
                                isVencido
                                  ? "bg-red-600 hover:bg-red-600 text-white"
                                  : item.status === "pago"
                                  ? "bg-green-600 hover:bg-green-600 text-white"
                                  : "bg-brand-500 hover:bg-brand-600 text-white"
                              }`}
                            >
                              {isVencido ? (
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                              ) : item.status === "pago" ? (
                                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                              ) : (
                                <Clock className="h-3 w-3 flex-shrink-0" />
                              )}
                              <span className="truncate">{statusText}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 min-w-[60px]">
                            <div className="flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-full flex-shrink-0"
                                onClick={() => {
                                  openCloseModal(item);
                                }}
                                title="Confirmar pagamento"
                              >
                                <Banknote size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={header.length + 1}
                        className="text-center py-12 text-brown-500"
                      >
                        <div className="flex flex-col items-center gap-3 min-w-full">
                          <FileText className="h-12 w-12 text-brown-300" />
                          <div className="text-center">
                            <p className="font-medium whitespace-nowrap">
                              {searchTerm
                                ? "Nenhuma notinha encontrada"
                                : "Nenhuma notinha pendente"}
                            </p>
                            <p className="text-sm text-brown-400 whitespace-nowrap">
                              {searchTerm
                                ? "Tente ajustar os critérios de pesquisa"
                                : "Todas as vendas estão em dia!"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Navegação de página */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center  pt-4 border-t border-brand-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-brown-700 hover:bg-brand-50"
              >
                Anterior
              </Button>
              <span className="text-sm text-brown-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-brown-700 hover:bg-brand-50"
              >
                Próximo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {dataNota && (
        <ModalConfirmVendaNota
          titleModal="Finalizando notinha"
          descriptionModal=""
          finish={() => sendFinish(dataNota)}
          isOpen={isOpen}
          closeModal={() => openCloseModal()}
          data={dataNota}
        />
      )}
    </>
  );
};
