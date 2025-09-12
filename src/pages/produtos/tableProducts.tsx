import { Check, RefreshCcw, Image, X } from "lucide-react";
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

interface Product {
  marca: string;
  codigo: string;
  [key: string]: any; // Permite propriedades adicionais
}

interface iCard {
  dataHeader: Array<string>;
  imgProduct: Array<string>;
  setImgProduct: Array<string>;
  dataBody: Array<Product>;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
  handleUpdate: (data: { valueCodigo: string; produto: string }) => void;
  setUpdate: boolean;
  isOpen: boolean;
  setDataUpdate: Array<string>;
  isImgOpen: boolean;
  setImgOpen: boolean;
}

export const TableBaseProduct: React.FC<iCard> = ({
  dataHeader,
  dataBody,
  imgProduct,
  setImgProduct,
  isImgOpen,
  setImgOpen,
  notifyError,
  notifySuccess,
  handleUpdate,
  setUpdate,
  isOpen,
  setDataUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputProduct, setInputProduct] = useState<string>("");
  const clickOnEdit = (
    index: number,
    currentPreco: string,
    produto: string
  ) => {
    setEditIndex(index);
    setInputValue(currentPreco);
    setInputProduct(produto);
  };

  const enviarCodigo = (codigo: string) => {
    const formatedValue = parseInt(inputValue);
    if (formatedValue >= 0) {
      handleUpdate(codigo, formatedValue, inputProduct);
      notifySuccess("Estoque atualizado com sucesso!");
      setEditIndex(null);
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

  const filteredData = dataBody.filter((item) => {
    const searchInMarca = item.marca
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchInCode = item.codigo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchInRef = item.ref
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const searchInProduct = item.produto
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return searchInMarca || searchInCode || searchInRef || searchInProduct;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <Card className="bg-app-bg-color text-left border-transparent">
        <CardHeader className="text-white">
          <CardTitle>Produtos cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="text-center mt-2 gap-4 b-red-600">
          <div>
            <Input
              type="text"
              placeholder="Pesquisar por marca ou código..."
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
                      {item[header.toLowerCase()]}
                    </TableCell>
                  ))}
                  <TableCell className="border-b-[1px] hover:bg-transparent space-x-4 space-y-1">
                    {editIndex === index ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          className="text-black"
                          value={inputProduct}
                          onChange={handleInputProductChange}
                          placeholder="Preencha o nome do produto."
                        />
                        <Input
                          className="text-black"
                          type="number"
                          value={inputValue}
                          placeholder="Preencha o estoque"
                          onChange={handleInputChange}
                        />
                        <Check
                          className="cursor-pointer text-green-600"
                          size="50"
                          onClick={() => enviarCodigo(item.codigo)}
                        />
                        <X
                          className="cursor-pointer text-red-600"
                          size="50"
                          onClick={() => setEditIndex(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {/* <Pencil
                          className="cursor-pointer"
                          onClick={() =>
                            clickOnEdit(index, item.preco, item.produto || "")
                          }
                        /> */}
                        <RefreshCcw
                          className="cursor-pointer text-green-600"
                          onClick={() => {
                            setUpdate(true);
                            isOpen(true);
                            setDataUpdate(item);
                          }}
                        />

                        <Image
                          className="cursor-pointer text-white"
                          onClick={() => {
                            setImgOpen(true);
                            setDataUpdate(item);
                          }}
                        />
                      </div>
                    )}
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
