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
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
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
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
      <Card className="bg-app-bg-color text-left border-transparent">
        <CardHeader className="text-white">
          <CardTitle>Clientes cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="text-center mt-2 gap-4 b-red-600">
          <div>
            <Input
              type="text"
              placeholder="Pesquise pelo nome ou cpf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-[25%]"
            />
          </div>
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {dataHeader.map((header, index) => (
                  <TableHead
                    className="text-center text-app-text-color font-bold hover:bg-transparent"
                    key={index}
                  >
                    {header.toUpperCase()}
                  </TableHead>
                ))}
                <TableHead className="text-center text-app-text-color font-bold hover:bg-transparent">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse hover:bg-transparent text-white">
              {paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className="text-center hover:bg-transparent"
                >
                  {dataHeader.map((header, idx) => (
                    <TableCell
                      key={idx}
                      className="border-b-[1px] hover:bg-transparent"
                    >
                      {item[header]}
                    </TableCell>
                  ))}
                  <TableCell className="border-b-[1px] hover:bg-transparent">
                    <button
                      title="Criar nova condicional"
                      //  onClick={() => sendCond(item["cpf"])}
                      onClick={() => confirmToast(item["cpf"], sendCond)}
                      disabled={loading}
                    >
                      <FileSliders size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex justify-center mt-4 text-white">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 border rounded"
            >
              Anterior
            </Button>
            <span className="px-4 py-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 border rounded"
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
