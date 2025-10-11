import { useState, useEffect, useCallback } from "react";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  Edit,
  Settings,
  Package,
  TrendingUp,
  Filter,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  GripVertical,
} from "lucide-react";
import { api } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface ProductAdmin {
  id: number;
  produto: string;
  marca: string;
  ref: string;
  sequencia: number;
  loja: boolean;
  estoque: number;
  preco: number;
  codigo: string;
  descricao: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

export function SiteConfig() {
  const [activeProducts, setActiveProducts] = useState<ProductAdmin[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<ProductAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSequence, setEditingSequence] = useState<number | null>(null);
  const [newSequence, setNewSequence] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_next: false,
    has_previous: false,
    next_page: null,
    previous_page: null,
  });

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchProducts = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: "20",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await api.get(`api/adm/produtos/sequencia/?${params}`);
      if (response.data.status === "sucesso") {
        // Atualiza produtos ativos (todos carregados)
        setActiveProducts(response.data.produtos_ativos || []);

        // Atualiza produtos inativos (paginados)
        setInactiveProducts(response.data.produtos_inativos || []);

        // Atualiza paginação (apenas para produtos inativos)
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      fetchProducts(1);
      return;
    }

    try {
      setSearchLoading(true);
      await fetchProducts(1, searchTerm);
    } catch (error) {
      toast.error("Erro ao pesquisar produtos");
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Debounce para pesquisa
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        fetchProducts(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchProducts(newPage, searchTerm);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Reordenar produtos localmente primeiro para feedback imediato
    const sortedActiveProducts = activeProducts.sort((a, b) => a.sequencia - b.sequencia);
    const reorderedProducts = Array.from(sortedActiveProducts);
    const [removed] = reorderedProducts.splice(sourceIndex, 1);
    reorderedProducts.splice(destinationIndex, 0, removed);

    // Calcular novas sequências
    const updatedProducts = reorderedProducts.map((product, index) => ({
      ...product,
      sequencia: index + 1,
    }));

    // Atualizar estado local imediatamente
    setActiveProducts(updatedProducts);

    try {
      // Enviar apenas as mudanças necessárias para o backend
      const productsToUpdate = updatedProducts.map((product, index) => ({
        id: product.id,
        sequencia: index + 1,
      }));

      await api.post("api/adm/produtos/atualizar-sequencia/", {
        produtos: productsToUpdate,
      });

      toast.success("Sequência dos produtos atualizada com sucesso!");
    } catch (error) {
      // Em caso de erro, reverte o estado local
      fetchProducts(1, searchTerm);
      toast.error("Erro ao atualizar sequência. Recarregando produtos...");
    }
  };

  const moveProduct = async (productId: number, direction: "up" | "down") => {
    const currentProduct = activeProducts.find((p) => p.id === productId);
    if (!currentProduct) return;

    const sortedActiveProducts = activeProducts.sort(
      (a, b) => a.sequencia - b.sequencia
    );
    const currentIndex = sortedActiveProducts.findIndex(
      (p) => p.id === productId
    );

    if (direction === "up" && currentIndex === 0) return;
    if (
      direction === "down" &&
      currentIndex === sortedActiveProducts.length - 1
    )
      return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetProduct = sortedActiveProducts[targetIndex];

    // Troca as sequências
    const newCurrentSequence = targetProduct.sequencia;
    const newTargetSequence = currentProduct.sequencia;

    try {
      await api.post("api/adm/produtos/atualizar-sequencia/", {
        produtos: [
          { id: productId, sequencia: newCurrentSequence },
          { id: targetProduct.id, sequencia: newTargetSequence },
        ],
      });

      // Atualiza o estado local dos produtos ativos
      setActiveProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId)
            return { ...product, sequencia: newCurrentSequence };
          if (product.id === targetProduct.id)
            return { ...product, sequencia: newTargetSequence };
          return product;
        })
      );
    } catch (error) {
      toast.error("Erro ao atualizar sequência");
    }
  };

  const updateSequence = async (productId: number) => {
    if (!newSequence) return;

    try {
      await api.post("api/adm/produtos/atualizar-sequencia/", {
        produtos: [{ id: productId, sequencia: parseInt(newSequence) }],
      });

      // Atualiza o estado local dos produtos ativos
      setActiveProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, sequencia: parseInt(newSequence) }
            : product
        )
      );

      setEditingSequence(null);
      setNewSequence("");
    } catch (error) {
      toast.error("Erro ao atualizar sequência");
    }
  };

  const toggleLojaStatus = async (
    productId: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await api.post("api/adm/produtos/toggle-loja/", {
        id: productId,
        loja: !currentStatus,
      });

      if (response.data.status === "sucesso") {
        // Move produto entre listas ativo/inativo
        if (currentStatus) {
          // Produto estava ativo, agora vai para inativo
          const productToMove = activeProducts.find((p) => p.id === productId);
          if (productToMove) {
            setActiveProducts((prev) => prev.filter((p) => p.id !== productId));
            setInactiveProducts((prev) => [
              ...prev,
              { ...productToMove, loja: false },
            ]);
          }
        } else {
          // Produto estava inativo, agora vai para ativo
          const productToMove = inactiveProducts.find(
            (p) => p.id === productId
          );
          if (productToMove) {
            setInactiveProducts((prev) =>
              prev.filter((p) => p.id !== productId)
            );
            setActiveProducts((prev) => [
              ...prev,
              { ...productToMove, loja: true },
            ]);
          }
        }
      }
    } catch (error) {
      toast.error("Erro ao atualizar status do produto");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Os produtos já vem separados do backend

  return (
    <Main className="bg-gradient-to-br from-neutral-50 to-brand-50 min-h-screen">
      <Nav />
      <ToastContainer />

      <div className="mx-auto p-6">
        {/* Header com gradiente e cards de estatísticas */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brown-500 rounded-xl opacity-10" />
          <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-200 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white shadow-lg">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-brown-800 mb-2">
                  Painel Administrativo
                </h1>
                <p className="text-brown-600 text-lg">
                  Gerencie a sequência e visibilidade dos produtos na loja
                </p>
              </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-100 text-sm font-medium">
                      Produtos Ativos
                    </p>
                    <p className="text-3xl font-bold">
                      {activeProducts.length}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brown-500 to-brown-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brown-100 text-sm font-medium">
                      Produtos Inativos
                    </p>
                    <p className="text-3xl font-bold">
                      {inactiveProducts.length}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <EyeOff className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">
                      Total de Produtos
                    </p>
                    <p className="text-3xl font-bold">
                      {activeProducts.length + inactiveProducts.length}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Elegante */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-brown-500/20 rounded-xl blur-xl group-hover:blur-sm transition-all duration-300" />
            <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-brand-200 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg text-white">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brown-800">
                    Pesquisar Produtos
                  </h2>
                  <p className="text-sm text-brown-600 mt-1">
                    Busque por código exato, referência ou nome do produto
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts(1, searchTerm)}
                  disabled={loading}
                  className="ml-auto border-brand-200 hover:bg-brand-50 text-brand-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Atualizar
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Digite para pesquisar por nome, marca ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-brand-200 focus:border-brand-400 focus:ring-brand-200 rounded-lg bg-white/80"
                />
                {searchTerm && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="bg-brand-100 text-brand-700 px-2 py-1 rounded-md text-sm font-medium">
                      {searchLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                      ) : null}
                      {pagination.total_items} resultados
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Paginação */}
        {pagination.total_pages > 1 && (
          <div className="mb-6">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-brand-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-brown-700">
                    Mostrando {inactiveProducts.length} de{" "}
                    {pagination.total_items} produtos inativos
                  </span>
                  <div className="flex items-center gap-2 text-sm text-brown-600">
                    <span>
                      Página {pagination.current_page} de{" "}
                      {pagination.total_pages}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={!pagination.has_previous || loading}
                    className="border-brand-200 hover:bg-brand-50"
                  >
                    Primeira
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={!pagination.has_previous || loading}
                    className="border-brand-200 hover:bg-brand-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={!pagination.has_next || loading}
                    className="border-brand-200 hover:bg-brand-50"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.total_pages)}
                    disabled={!pagination.has_next || loading}
                    className="border-brand-200 hover:bg-brand-50"
                  >
                    Última
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Produtos Ativos */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-brand-500/10 rounded-xl blur-xl" />
          <Card className="relative bg-white/90 backdrop-blur-sm border-emerald-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-brand-50 border-b border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg text-white">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-brown-800">
                      Produtos Ativos na Loja
                    </CardTitle>
                    <p className="text-brown-600 mt-1">
                      {activeProducts.length} produtos visíveis para os clientes - Arraste para reordenar
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold">
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  {activeProducts.length} ativos
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                    <p className="text-brown-600 font-medium">
                      Carregando produtos...
                    </p>
                  </div>
                </div>
              ) : activeProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-dashed border-gray-300">
                    <EyeOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Nenhum produto ativo
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? (
                        <>
                          Nenhum produto encontrado para "{searchTerm}".
                          <br />
                          Tente buscar por outro termo ou limpe a pesquisa.
                        </>
                      ) : (
                        <>
                          Não há produtos visíveis na loja no momento.
                          <br />
                          Ative alguns produtos na seção abaixo para começar.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="active-products">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-4 transition-all duration-200 ${
                          snapshot.isDraggingOver
                            ? "bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-xl p-4"
                            : ""
                        }`}
                      >
                        {activeProducts
                          .sort((a, b) => a.sequencia - b.sequencia)
                          .map((product, index) => {
                            const isFirst = index === 0;
                            const isLast = index === activeProducts.length - 1;

                            return (
                              <Draggable
                                key={product.id.toString()}
                                draggableId={product.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`group relative overflow-hidden bg-gradient-to-r from-white to-emerald-50/30 border-2 border-emerald-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                                      snapshot.isDragging
                                        ? "scale-105 shadow-2xl rotate-2 z-50"
                                        : "hover:scale-[1.02]"
                                    }`}
                                  >
                                    {/* Indicador de posição */}
                                    <div className="absolute top-0 left-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-br-lg font-bold text-sm">
                                      #{index + 1}
                                    </div>

                                    <div className="p-6 pt-8">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                          {/* Handle de Drag */}
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-grab active:cursor-grabbing p-2 hover:bg-emerald-100 rounded-lg transition-colors group/drag"
                                          >
                                            <GripVertical 
                                              className={`h-6 w-6 text-emerald-400 group-hover/drag:text-emerald-600 transition-colors ${
                                                snapshot.isDragging ? 'text-emerald-600' : ''
                                              }`} 
                                            />
                                          </div>

                                          {/* Controles de movimento (desabilitados quando drag está ativo) */}
                                          <div className="flex flex-col gap-2 opacity-30 pointer-events-none">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      moveProduct(product.id, "up")
                                    }
                                    disabled={isFirst}
                                    className={`p-2 h-10 w-10 rounded-lg transition-all duration-200 ${
                                      isFirst
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-300 hover:scale-110"
                                    }`}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      moveProduct(product.id, "down")
                                    }
                                    disabled={isLast}
                                    className={`p-2 h-10 w-10 rounded-lg transition-all duration-200 ${
                                      isLast
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-300 hover:scale-110"
                                    }`}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Controle de sequência */}
                                <div className="flex items-center gap-3">
                                  {editingSequence === product.id ? (
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-brand-200">
                                      <span className="text-sm font-medium text-brown-700">
                                        Nova posição:
                                      </span>
                                      <Input
                                        type="number"
                                        value={newSequence}
                                        onChange={(e) =>
                                          setNewSequence(e.target.value)
                                        }
                                        className="w-20 h-9 text-center border-brand-200 focus:border-brand-400"
                                        placeholder={product.sequencia.toString()}
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          updateSequence(product.id)
                                        }
                                        className="h-9 bg-emerald-600 hover:bg-emerald-700"
                                      >
                                        Salvar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingSequence(null);
                                          setNewSequence("");
                                        }}
                                        className="h-9 border-gray-300 hover:bg-gray-50"
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">
                                        Sequência #{product.sequencia}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingSequence(product.id);
                                          setNewSequence(
                                            product.sequencia.toString()
                                          );
                                        }}
                                        className="p-2 h-9 w-9 hover:bg-brand-50 text-brand-600 rounded-lg"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Informações do produto */}
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-brand-100">
                                    <h3 className="font-bold text-xl text-brown-800 mb-2 truncate">
                                      {product.produto}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-brown-600">
                                          Marca:
                                        </span>
                                        <span className="text-sm bg-brown-100 text-brown-700 px-2 py-1 rounded font-medium">
                                          {product.marca}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-brown-600">
                                          Ref:
                                        </span>
                                        <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded font-medium">
                                          {product.ref}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-brown-600">
                                          Estoque:
                                        </span>
                                        <span
                                          className={`text-sm px-2 py-1 rounded font-medium ${
                                            product.estoque > 10
                                              ? "bg-emerald-100 text-emerald-700"
                                              : product.estoque > 0
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-red-100 text-red-700"
                                          }`}
                                        >
                                          {product.estoque} unidades
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-brown-600">
                                          Preço:
                                        </span>
                                        <span className="text-lg font-bold text-emerald-600">
                                          {formatPrice(product.preco)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Botão de controle de visibilidade */}
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={() =>
                                    toggleLojaStatus(product.id, product.loja)
                                  }
                                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105 ${
                                    product.loja
                                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                                  }`}
                                >
                                  {product.loja ? (
                                    <>
                                      <EyeOff className="h-5 w-5 mr-2" />
                                      Ocultar da Loja
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-5 w-5 mr-2" />
                                      Mostrar na Loja
                                    </>
                                  )}
                                </Button>
                                <div className="text-center">
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      product.loja
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {product.loja ? "ATIVO" : "INATIVO"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                        {activeProducts.length === 0 && !loading && (
                          <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-dashed border-gray-300">
                              <EyeOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Nenhum produto ativo
                              </h3>
                              <p className="text-gray-500">
                                {searchTerm ? (
                                  <>
                                    Nenhum produto encontrado para "{searchTerm}".
                                    <br />
                                    Tente buscar por outro termo ou limpe a pesquisa.
                                  </>
                                ) : (
                                  <>
                                    Não há produtos visíveis na loja no momento.
                                    <br />
                                    Ative alguns produtos na seção abaixo para
                                    começar.
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
              )}
            </CardContent>
          </Card>
        </div>

        {/* Produtos Inativos */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-neutral-500/10 rounded-xl blur-xl" />
          <Card className="relative bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-neutral-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg text-white">
                    <EyeOff className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-brown-800">
                      Produtos Inativos
                    </CardTitle>
                    <p className="text-brown-600 mt-1">
                      {inactiveProducts.length} produtos ocultos dos clientes
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  <Filter className="h-4 w-4 inline mr-2" />
                  {inactiveProducts.length} inativos
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {inactiveProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 opacity-75 hover:opacity-100"
                  >
                    {/* Badge de inativo */}
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-gray-500 to-gray-600 text-white px-3 py-1 rounded-br-lg font-bold text-sm">
                      INATIVO
                    </div>

                    <div className="p-6 pt-8">
                      <div className="flex items-center justify-between">
                        {/* Informações do produto */}
                        <div className="flex-1 min-w-0 mr-6">
                          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-xl text-gray-700 mb-2 truncate">
                              {product.produto}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Marca:
                                </span>
                                <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">
                                  {product.marca}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Ref:
                                </span>
                                <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">
                                  {product.ref}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Estoque:
                                </span>
                                <span
                                  className={`text-sm px-2 py-1 rounded font-medium ${
                                    product.estoque > 10
                                      ? "bg-emerald-100 text-emerald-700"
                                      : product.estoque > 0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {product.estoque} unidades
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Preço:
                                </span>
                                <span className="text-lg font-bold text-emerald-600">
                                  {formatPrice(product.preco)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botão de ativação */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() =>
                              toggleLojaStatus(product.id, product.loja)
                            }
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105"
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            Ativar na Loja
                          </Button>
                          <div className="text-center">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              PRODUTO OCULTO
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {inactiveProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border-2 border-dashed border-emerald-300">
                      <Sparkles className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                        Todos os produtos estão ativos!
                      </h3>
                      <p className="text-emerald-500">
                        Parabéns! Todos os seus produtos estão visíveis na loja.
                        <br />
                        Os clientes podem ver e comprar todos os itens
                        disponíveis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
