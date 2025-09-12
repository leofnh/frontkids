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
import { Button } from "../../components/ui/button";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useData } from "../../components/context";
import { ModalCreateFunc } from "./modalCreateFunc";

interface iCard {
  title: string;
  description: string;
  data: Array<string>;
  notifyError: (text: string) => void;
  notifySuccess: (text: string) => void;
}

export const CardDashVendedor: React.FC<iCard> = ({
  title,
  description,
  data,
  notifyError,
  notifySuccess,
}) => {
  const { setDashboard, formatedMoney } = useData();
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateFunc, setCreateFunc] = useState(false);
  const [dataNota, setDataNota] = useState();
  const openCloseModal = (item) => {
    setDataNota(item);
    setIsOpen(!isOpen);
  };

  const header = ["id", "username", "MÊS ANTERIOR", "MÊS ATUAL"];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Filtrar dados com base no termo de busca
  useEffect(() => {
    const searchData = data.filter((item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(searchData);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [loading, setLoading] = useState(false);
  const sendFinish = async (data: Array<string>) => {
    setLoading(true);
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
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-white text-app-bg-color h-[100%] w-[100%]">
        <CardHeader>
          <CardTitle>
            <div className="flex">
              <span>{title}</span>
              <span className="ml-auto">
                <Button
                  className="h-auto bg-green-600 hover:bg-green-600"
                  onClick={() => setCreateFunc(!isCreateFunc)}
                >
                  Criar Vendedor
                </Button>
              </span>
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-app-bg-color">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Pesquisar pelo nome do vendedor...."
              className="px-4 py-2 border rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table className="items-center justify-center">
            <TableCaption>Vendas realizadas por vendedores</TableCaption>
            <TableHeader>
              <TableRow>
                {header.map((header, index) => (
                  <TableHead key={index}>{header.toUpperCase()}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse">
              {currentData.map((item, index) => {
                return (
                  <TableRow key={index} className="text-left">
                    <TableCell className="border-b-[1px]">{item.id}</TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.username}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {formatedMoney(item.venda_anterior)}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {formatedMoney(item.venda_atual)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Navegação de página */}
          <div className="flex justify-between mt-4">
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
