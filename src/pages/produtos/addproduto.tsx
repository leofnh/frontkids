import { Modal } from "../../components/modalBase";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ProdutoCondicional } from "../../components/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Scan,
  Plus,
  Package,
  DollarSign,
  Hash,
  CheckCircle2,
  Loader2,
  PackageSearch,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

interface iAddProdutoCondicional {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  produtos: ProdutoCondicional[];
  idCondicional: number | null;
  setProdutosCondicionais: (data: ProdutoCondicional[]) => void;
}

export const AddProdutoCondicional: React.FC<iAddProdutoCondicional> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  idCondicional,
}) => {
  const [codigo, setCodigo] = useState("");
  const [produtosCond, setProdutoCond] = useState<ProdutoCondicional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const sendProdutoCond = async () => {
    if (!codigo.trim()) {
      toast.error("Por favor, digite um código válido");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("codigo", codigo);
      data.append("condicional", String(idCondicional));

      const response = await api.post("api/add/produto-condicional/", data);
      const status = response.data.status;
      const msg = response.data.msg;

      if (status == "sucesso") {
        const dados = response.data.dados_produtos;
        setProdutoCond(dados);
        setCodigo("");
        setSuccessAnimation(true);
        toast.success("Produto adicionado com sucesso!");

        // Reset animation after delay
        setTimeout(() => setSuccessAnimation(false), 2000);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar produto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getProdutos = async () => {
      setIsLoadingTable(true);
      try {
        const response = await api.get("api/adm/condicional/");
        const status = response.data.status;
        if (status == "sucesso") {
          const dados = response.data.dados_produtos;
          setProdutoCond(dados);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar produtos");
      } finally {
        setIsLoadingTable(false);
      }
    };
    getProdutos();
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      // overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed inset-4 z-50 mx-auto my-auto w-full max-w-4xl max-h-[calc(100vh-2rem)] border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col md:inset-8 lg:inset-16">
        {/* Header with Gradient - Fixed */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-brand-500 via-brand-600 to-brown-600 p-4 md:p-6 lg:p-8 text-white overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm flex-shrink-0">
                  <PackageSearch className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
                    {titleModal}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base lg:text-lg line-clamp-2">
                    {descriptionModal}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90 flex-shrink-0"
              >
                <Plus className="h-5 w-5 md:h-6 md:w-6 rotate-45 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Produtos Condicionais</span>
                <span className="sm:hidden">Produtos</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                <span>
                  {produtosCond?.filter((p) => p.condicional === idCondicional)
                    .length || 0}{" "}
                  itens
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Modern Form Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Adicionar Produto por Código
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Digite ou escaneie o código de barras do produto
              </p>
            </div>

            {/* Enhanced Input Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700">
                  <Scan className="h-4 w-4 md:h-5 md:w-5 text-brand-500" />
                  Código do Produto
                </Label>

                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300`}
                  ></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 md:left-4 z-10">
                      <Hash
                        className={`h-4 w-4 md:h-5 md:w-5 transition-colors duration-200 ${
                          inputFocused ? "text-brand-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <Input
                      placeholder="Digite ou escaneie o código de barras"
                      className="pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onKeyDown={(e) => e.key === "Enter" && sendProdutoCond()}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={sendProdutoCond}
                    disabled={isLoading || !codigo.trim()}
                    className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                      successAnimation
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        <span className="hidden sm:inline">Adicionando...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : successAnimation ? (
                      <>
                        <CheckCircle2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Adicionado!</span>
                        <span className="sm:hidden">OK!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">
                          Adicionar Produto
                        </span>
                        <span className="sm:hidden">Adicionar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Modern Products Table Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Produtos Adicionados
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Lista dos produtos neste condicional
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-brand-100 rounded-full self-start sm:self-auto">
                <Package className="h-3 w-3 md:h-4 md:w-4 text-brand-600" />
                <span className="font-semibold text-brand-700 text-sm md:text-base">
                  {produtosCond?.filter(
                    (fil) => fil.condicional === idCondicional
                  ).length || 0}{" "}
                  <span className="hidden sm:inline">produtos</span>
                  <span className="sm:hidden">itens</span>
                </span>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingTable ? (
              <div className="flex items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-500" />
                  <p className="text-gray-600 font-medium">
                    Carregando produtos...
                  </p>
                </div>
              </div>
            ) : produtosCond?.filter((fil) => fil.condicional === idCondicional)
                .length > 0 ? (
              /* Modern Table - Responsive */
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Mobile Card Layout */}
                <div className="block md:hidden">
                  {produtosCond
                    ?.filter((fi) => fi.condicional === idCondicional)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-brand-50/30 hover:to-transparent transition-all duration-200"
                      >
                        <div className="space-y-3">
                          {/* Product Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-brand-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 truncate">
                                {item.nome}
                              </p>
                              <p className="text-sm text-gray-500">
                                Produto condicional
                              </p>
                            </div>
                          </div>

                          {/* Code and Price */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Hash className="h-3 w-3 text-brand-500" />
                              <div className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs text-gray-700">
                                {item.produto}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-brand-500" />
                              <span className="text-lg font-bold text-brand-600">
                                R${" "}
                                {typeof item.preco === "number"
                                  ? item.preco.toFixed(2)
                                  : item.preco}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <TableHead className="text-left font-bold text-gray-700 py-3 md:py-4 px-4 md:px-6">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-brand-500" />
                            PRODUTO
                          </div>
                        </TableHead>
                        <TableHead className="text-left font-bold text-gray-700 py-3 md:py-4 px-4 md:px-6">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-brand-500" />
                            CÓDIGO
                          </div>
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700 py-3 md:py-4 px-4 md:px-6">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4 text-brand-500" />
                            PREÇO
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosCond
                        ?.filter((fi) => fi.condicional === idCondicional)
                        .map((item, index) => (
                          <TableRow
                            key={index}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-brand-50/30 hover:to-transparent transition-all duration-200 group"
                          >
                            <TableCell className="py-3 md:py-4 px-4 md:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                                  <Package className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {item.nome}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Produto condicional
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 md:py-4 px-4 md:px-6">
                              <div className="flex items-center gap-2">
                                <div className="px-2 md:px-3 py-1 bg-gray-100 rounded-lg font-mono text-sm text-gray-700">
                                  {item.produto}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 md:py-4 px-4 md:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-lg md:text-xl font-bold text-brand-600">
                                  R${" "}
                                  {typeof item.preco === "number"
                                    ? item.preco.toFixed(2)
                                    : item.preco}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              /* Empty State - Responsive */
              <div className="text-center py-8 md:py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl md:rounded-2xl border-2 border-dashed border-gray-200 mx-auto">
                <div className="space-y-3 md:space-y-4 px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                    <PackageSearch className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
                      Adicione produtos usando o código de barras acima
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                    <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-center">
                      <span className="hidden sm:inline">
                        Dica: Use o leitor de código de barras para agilizar
                      </span>
                      <span className="sm:hidden">
                        Use o leitor de código para agilizar
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
