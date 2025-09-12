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
import { useData } from "../../components/context";
import { Truck } from "lucide-react";
import { ModalSendProduct } from "./modalsend";
type ProductCarrinho = {
  produto: string;
  nome_usuario: string;
  id_produto: number;
  quantidade: number;
  marca: string;
  codigo: string;
  cliente: string;
  preco: number;
  endereco: string;
  cadastro: string;
  contato: string;
  enviado: boolean;
  cidade: string;
  estado: string;
  email?: string;
};
interface iCard {
  title: string;
  description: string;
  data: ProductCarrinho[];
  //notifyError: (text: string) => void;
  //notifySuccess: (text: string) => void;
}

export const CardDashSite: React.FC<iCard> = ({ title, description, data }) => {
  const { formatedMoney, formatedDate } = useData() as {
    formatedMoney: (value: number) => string;
    formatedDate: (value: string) => string;
  };

  const header = [
    "CLIENTE",
    "PRODUTO",
    "VENDA",
    "ENDEREÇO",
    "DATA",
    "CONTATO",
    "ENVIADO",
    "AÇÕES",
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState<ProductCarrinho | null>(null);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const closeModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const searchData = data.filter((item) =>
      item.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Card className="bg-white text-app-bg-color h-[100%] w-[100%]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-app-bg-color">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Pesquisar pelo nome do cliente...."
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
                    <TableCell className="border-b-[1px]">
                      {item.cliente}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.codigo}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {formatedMoney(item.preco)}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.cidade}, {item.estado}, {item.endereco}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {formatedDate(item.cadastro)}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.contato}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.enviado ? "Enviado" : "Não enviado"}
                    </TableCell>
                    <TableCell className="border-b-[1px]">
                      {item.enviado ? (
                        "Enviado"
                      ) : (
                        <>
                          <div className="flex space-x-2">
                            <div>
                              <Truck
                                className="cursor-pointer"
                                onClick={() => {
                                  setItemId(item);
                                  closeModal();
                                }}
                              />
                            </div>
                            <div>{/* adicionar acões */}</div>
                          </div>
                        </>
                      )}
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
      <ModalSendProduct
        titleModal="Envio por correios"
        isOpen={isOpen}
        closeModal={closeModal}
        item={itemId}
        descriptionModal="Confira o endereço antes do envio."
      />
      ,
    </>
  );
};
