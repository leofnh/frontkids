import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { CondicionalType, ProdutoCondicional } from "../../components/types";
import { Plus } from "lucide-react";
import { AddProdutoCondicional } from "./addproduto";

interface iCard {
  condicionais: CondicionalType[];
  produtos: ProdutoCondicional[];
  setProdutosCondicionais: (data: ProdutoCondicional[]) => void;
}

export const TableCondicionais: React.FC<iCard> = ({
  condicionais,
  produtos,
  setProdutosCondicionais,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addProduto, setAddProduto] = useState(false);
  const [idCondicional, setIdCondicional] = useState<number | null>();
  // const [isCondicional, setProdutosCondicionais] = useState<
  //   ProdutoCondicional[]
  // >([]);

  const filteredData = condicionais.filter((item) => {
    const searchNome = item.nome
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchCpf = item.cliente
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return searchNome || searchCpf;
  });
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const handleProduto = (condicional: number) => {
  //   const filterProduto = produtos?.filter(
  //     (it) => it.condicional == condicional
  //   );
  //   setProdutosCondicionais(filterProduto);
  // };
  return (
    <>
      <Card className="bg-app-bg-color text-left border-gray-500 ">
        <CardHeader className="text-white">
          <CardTitle>Produtos em condicional</CardTitle>
        </CardHeader>
        <CardContent className="text-center mt-2 gap-4 b-red-600">
          <div>
            <Input
              type="text"
              placeholder="Pesquise pelo nome do cliente ou cpf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-[25%]"
            />
          </div>
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center text-app-text-color font-bold hover:bg-transparent">
                  Cliente
                </TableHead>
                <TableHead className="text-center text-app-text-color font-bold hover:bg-transparent">
                  CPF
                </TableHead>
                <TableHead className="text-center text-app-text-color font-bold hover:bg-transparent">
                  Aberto
                </TableHead>
                <TableHead className="text-center text-app-text-color font-bold hover:bg-transparent">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse hover:bg-transparent text-white">
              {filteredData.map((it) => (
                <>
                  <TableRow className="text-center hover:bg-transparent">
                    <TableCell className="border-b-[1px] hover:bg-transparent">
                      {it.nome}
                    </TableCell>
                    <TableCell className="border-b-[1px] hover:bg-transparent">
                      {it.cliente}
                    </TableCell>
                    <TableCell className="border-b-[1px] hover:bg-transparent">
                      {new Date(it.cadastro).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="border-b-[1px] hover:bg-transparent">
                      <button
                        className="text-green-600"
                        title="adicionar produtos"
                        onClick={() => {
                          setAddProduto(!addProduto);
                          setIdCondicional(it.id);
                          // handleProduto(it.id);
                        }}
                      >
                        <Plus />
                      </button>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>

          {addProduto && (
            <AddProdutoCondicional
              titleModal="Produtos da condicional"
              descriptionModal="Adicione e visualize os produtos"
              isOpen={addProduto}
              closeModal={() => setAddProduto(!addProduto)}
              produtos={produtos}
              idCondicional={idCondicional ?? null}
              setProdutosCondicionais={() => setProdutosCondicionais}
            />
          )}

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
