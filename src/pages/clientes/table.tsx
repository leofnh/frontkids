import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { DataCliente } from "../../components/types";

interface iCard {
  dataHeader: Array<keyof DataCliente>;
  dataBody: DataCliente[];
  setDataUpdate: (data: DataCliente) => DataCliente;
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
  const itemsPerPage = 10;

  // Função para filtrar dados com base no termo de pesquisa
  const filteredData = dataBody.filter((item) => {
    const searchInName = item.nome
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchInCpf = item.cpf
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return searchInName || searchInCpf;
  });

  // Função para calcular os dados exibidos na página atual
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Função para alterar a página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Número total de páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <Card className="bg-app-bg-color text-left border-transparent">
        <CardHeader className="text-white">
          <CardTitle>Clientes cadastrados</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-center mt-2 gap-4 b-red-600">
          <div>
            <Input
              type="text"
              placeholder="Pesquisar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-[25%]"
            />
          </div>

          <Table className="mt-4 b-transparent text-white">
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                {dataHeader.map((header, index) => (
                  <TableHead className="text-white" key={index}>
                    {header.toUpperCase()}
                  </TableHead>
                ))}
                <TableHead className="text-white">AÇÕES</TableHead>{" "}
                {/* Cabeçalho extra para a coluna de ações */}
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse text-center items-center">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={dataHeader.length + 1}
                    className="text-center"
                  >
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={index} className="text-left">
                    {dataHeader.map((header, idx) => (
                      <TableCell key={idx} className="border-b-[1px]">
                        {item[header]}{" "}
                      </TableCell>
                    ))}
                    <TableCell className="border-b-[1px] ">
                      <RefreshCcw
                        className="cursor-pointer text-green-600"
                        size="18"
                        onClick={() => {
                          setDataUpdate(item);
                          setIsUpdate(true);
                          setCreateObject(true);
                        }}
                      />{" "}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex justify-center mt-4 text-white">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 border rounded"
            >
              Anterior
            </Button>
            <span className="px-4 py-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 border rounded text-white"
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
