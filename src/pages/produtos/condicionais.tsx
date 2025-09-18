import { useState } from "react";
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
import { Plus, SquareCheck } from "lucide-react";
import { AddProdutoCondicional } from "./addproduto";
import { api } from "../../services/api";

interface iCard {
  condicionais: CondicionalType[];
  produtos: ProdutoCondicional[];
  setProdutosCondicionais: (data: ProdutoCondicional[]) => void;
  setCondicional: (data: CondicionalType[]) => void;
}

export const TableCondicionais: React.FC<iCard> = ({
  condicionais,
  produtos,
  setProdutosCondicionais,
  setCondicional,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addProduto, setAddProduto] = useState(false);
  const [idCondicional, setIdCondicional] = useState<CondicionalType | null>(
    null
  );
  const fecharCondicional = async (id: number) => {
    try {
      const response = await api.put(`api/adm/condicional/?id_cond=${id}`);
      const status = response.data.status;
      if (status === "sucesso") {
        const dados = response.data.dados;
        setCondicional(dados);
      }
    } catch (error) {
      console.error("Erro ao fechar condicional:", error);
    }
  };
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

  return (
    <div className="space-y-6">
      {/* Header com pesquisa */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-brand-100 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-brown-800">
            Produtos em Condicional
          </h2>
          <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
            {filteredData.length} cliente{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <Input
            type="text"
            placeholder="Pesquise pelo nome do cliente ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-brown-200 focus:border-brand-400 focus:ring-brand-400/20"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-brand-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-brand-200 bg-brand-50">
                <TableHead className="text-center text-brown-700 font-semibold py-4">
                  CLIENTE
                </TableHead>
                <TableHead className="text-center text-brown-700 font-semibold py-4">
                  CPF
                </TableHead>
                <TableHead className="text-center text-brown-700 font-semibold py-4">
                  ABERTO EM
                </TableHead>
                <TableHead className="text-center text-brown-700 font-semibold py-4">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((it) => (
                <TableRow
                  key={it.id}
                  className="text-center hover:bg-brand-50/50 transition-colors border-b border-brand-100"
                >
                  <TableCell className="py-3 text-brown-700 font-medium">
                    {it.nome}
                  </TableCell>
                  <TableCell className="py-3 text-brown-700 font-medium">
                    {it.cliente}
                  </TableCell>
                  <TableCell className="py-3 text-brown-700 font-medium">
                    {new Date(it.cadastro).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-105 border border-blue-200 hover:border-blue-300"
                        title="Adicionars produtos"
                        onClick={() => {
                          setAddProduto(!addProduto);
                          setIdCondicional(it);
                        }}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>

                      <button
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105 border border-red-200 hover:border-red-300"
                        title="Finalizar condicional"
                        onClick={() => {
                          fecharCondicional(it.id);
                        }}
                      >
                        <SquareCheck size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-brand-100 bg-brand-25">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-brand-200 hover:bg-brand-50"
            >
              Anterior
            </Button>
            <span className="text-sm text-brown-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-brand-200 hover:bg-brand-50"
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Produtos */}
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
    </div>
  );
};
