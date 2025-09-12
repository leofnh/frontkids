import { Banknote } from "lucide-react";
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
  TableCaption,
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
    formatedMoney: (value: number) => number;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [dataNota, setDataNota] = useState();
  const openCloseModal = (item) => {
    setDataNota(item);
    setIsOpen(!isOpen);
  };

  const header = ["Cliente", "Produto", "Vencimento", "Valor", "Status"];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Filtrar dados com base no termo de busca
  useEffect(() => {
    const searchData = data.filter((item) =>
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(searchData);
    setCurrentPage(1);
  }, [searchTerm, data]);

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
        setDashboard((prevDash) => ({
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
      <Card className="bg-white text-app-bg-color ">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-app-bg-color max-h-[750px] min-h-[550px]">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Pesquisar pelo nome do cliente...."
              className="px-4 py-2 border rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                {header.map((header, index) => (
                  <TableHead key={index}>{header.toUpperCase()}</TableHead>
                ))}
                <TableHead>AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse">
              {currentData.map((item, index) => {
                const isVencido = new Date(item.vencimento) < new Date();
                const capitalizeFirstLetter = (string) => {
                  return (
                    string.charAt(0).toUpperCase() +
                    string.slice(1).toLowerCase()
                  );
                };
                const statusText = isVencido
                  ? "Vencido"
                  : capitalizeFirstLetter(item.status);
                return (
                  <TableRow key={index} className="text-left">
                    <TableCell className="border-b-[1px]">
                      {item.cliente}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.produto}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {new Date(item.vencimento).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {formatedMoney(item.valor)}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      <Badge
                        className={`text-left ${
                          isVencido
                            ? "bg-red-600 hover:bg-red-600 text-white"
                            : "bg-orange-700"
                        }`}
                      >
                        {statusText}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      <button
                        className="text-green-600"
                        onClick={() => {
                          openCloseModal(item);
                        }}
                      >
                        <Banknote />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Navegação de página */}
          <div className="flex justify-between mt-auto">
            <Button
              className="px-4 py-2 bg-app-bg-color rounded"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              className="px-4 py-2 bg-app-bg-color rounded"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
      <ModalConfirmVendaNota
        titleModal="Finalizando notinha"
        descriptionModal=""
        finish={sendFinish}
        isOpen={isOpen}
        closeModal={openCloseModal}
        data={dataNota}
      />
    </>
  );
};
