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
import { useState } from "react";
import { useData } from "../../components/context";
import { CondicionalType, DataCliente } from "../../components/types";
import { FileSliders } from "lucide-react";
import { api } from "../../services/api";
import { toast } from "react-toastify";

interface iCard {
  setCondicional: (data: CondicionalType[]) => void;
}

export const TableClientCondicional: React.FC<iCard> = ({ setCondicional }) => {
  const { dataClient } = useData() as {
    dataClient: DataCliente[];
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const dataHeader: Array<keyof DataCliente> = ["nome", "cpf", "rua", "bairro"];

  const filteredData = dataClient.filter((item) => {
    const searchNome = item.nome
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchCpf = item.cpf
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return searchNome || searchCpf;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const sendCond = async (cpf: string) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("cpf", cpf);
      const response = await api.post("api/adm/condicional/", data);
      const status = response.data.status;
      const msg = response.data.msg;
      if (status == "sucesso") {
        const dados = response.data.dados;
        toast.success(msg, {
          autoClose: 3000,
          position: "top-right",
        });
        setCondicional(dados);
      } else {
        toast.error(msg, {
          autoClose: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmToast = (cpf: string, sendCond: (cpf: string) => void) => {
    const ToastContent = ({ closeToast }: { closeToast?: () => void }) => (
      <div className="flex flex-col gap-2">
        <span>Deseja realmente criar uma nova condicional?</span>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-brown-100 text-brown-700 px-3 py-1 rounded-lg hover:bg-brown-200 transition-colors"
            onClick={() => {
              closeToast?.();
              toast.error("Ação cancelada.", {
                autoClose: 2000,
                position: "top-right",
              });
            }}
          >
            Cancelar
          </button>
          <button
            className="bg-brand-500 text-white px-3 py-1 rounded-lg hover:bg-brand-600 transition-colors"
            onClick={() => {
              closeToast?.();
              sendCond(cpf);
              //   toast.success("Condicional criada com sucesso!");
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    );

    toast.info(<ToastContent />, {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      position: "top-left",
    });
  };

  return (
    <>
      <Card className="bg-white border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-brown-800">
              Clientes Cadastrados
            </CardTitle>
            <div className="text-sm text-brown-600 bg-brand-100 px-3 py-1 rounded-full">
              {filteredData.length} cliente
              {filteredData.length !== 1 ? "s" : ""} encontrado
              {filteredData.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Barra de pesquisa */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Pesquisar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-4 py-2 bg-white border-brand-200 text-brown-800 placeholder-brown-400 focus:border-brand-400 focus:ring-brand-200"
              />
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
                            className="text-brand-600 hover:text-brand-700 hover:bg-brand-100 p-2 rounded-lg"
                            onClick={() => confirmToast(item["cpf"], sendCond)}
                            disabled={loading}
                            title="Criar nova condicional"
                          >
                            <FileSliders size={18} />
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
                        ? "Nenhum cliente encontrado para a busca realizada."
                        : "Nenhum cliente cadastrado no momento."}
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
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} de{" "}
                {filteredData.length} clientes
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  Anterior
                </Button>

                <span className="text-sm text-brown-600 px-3 py-1">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-brown-700 hover:bg-brand-50 disabled:opacity-50"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
