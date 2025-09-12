import { useData } from "../../components/context";
import { Main } from "../../components/main";
import { FooterSite, NavSite } from "../../components/navsite";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../services/api";
import { Star, ShoppingCart, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Link } from "react-router-dom";

interface ProductGroup {
  ref: string;
  produto: string;
  marca: string;
  preco: number;
  id: number;
  estoque: number;
  codigo: string;
  //custo: number;
  update: string;
  sequencia: number;
  descricao: string;
  coresETamanhos: Array<{
    cor: string;
    tamanho: string | number;
    estoque: number;
    id_product_loja: number;
  }>;
}

type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

type Product = {
  produto: string;
  codigo: string;
  estoque: number;
  marca: string;
  //custo: string;
  preco: number;
  ref: string;
  tamanho: string;
  loja: boolean;
  id: number;
  update: string;
  cadastro: string;
  sequencia: number;
  descricao: string;
  cor: string;
};
type imgType = {
  url: string;
  id_produto: string;
  ref: string;
};
type ProductCarrinho = ProductGroup & {
  produto?: string;
  nome_usuario?: string;
  id_produto?: number;
  quantidade?: number;
  marca?: string;
  // link: string;
};

type TypeIdSubmit = {
  product_id: number;
  id_produto: number;
};

type userDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

type UnidadesType = {
  [id: number]: { uquantidade: number };
};
const ITEMS_PER_PAGE = 12;
export function LojaProdutos() {
  const {
    dataProductLoja,
    userData,
    setLojaCarrinho,
    isAuthenticated,
    lojaCarrinho,
    imgProduct,
    setImgProduct,
    isConfigSite,
  } = useData() as {
    lojaCarrinho: ProductCarrinho[];
    imgProduct: imgType[];
    dataProductLoja: Product[];
    isAuthenticated: boolean;
    setImgProduct: (data: imgType[]) => void;
    setLojaCarrinho: (data: ProductCarrinho[]) => ProductCarrinho[];
    userData: userDataType[];
    isConfigSite: ConfigSiteType;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [idSubmit, setIdSubmit] = useState<TypeIdSubmit[]>([]);
  const products = dataProductLoja;
  const filteredProducts = products.filter((product) =>
    product.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const groupedProducts = Object.values(
    filteredProducts.reduce((acc, product) => {
      const {
        ref,
        produto,
        marca,
        preco,
        codigo,
        id,
        estoque,
        sequencia,
        descricao,
        update,
      } = product;
      if (!acc[ref] || new Date(update) > new Date(acc[ref].update)) {
        acc[ref] = {
          ref,
          produto,
          marca,
          preco,
          codigo,
          id,
          estoque,
          update,
          sequencia,
          descricao,
          coresETamanhos: [],
        };
      }
      // Adiciona as informações específicas (cor, tamanho, estoque)
      acc[ref].coresETamanhos.push({
        cor: product.cor,
        tamanho: product.tamanho,
        estoque: product.estoque,
        id_product_loja: product.id,
      });

      return acc;
    }, {} as Record<string, ProductGroup>)
  ).sort((a, b) => a.sequencia - b.sequencia);
  console.log(groupedProducts);
  const [unidades, setUnidades] = useState<UnidadesType>(
    products.reduce((acc, product) => {
      acc[product.id] = { uquantidade: 1 };
      return acc;
    }, {} as UnidadesType)
  );
  // const handleIncrement = (id: number, estoque: number) => {
  //   const unitTotal = unidades[id].uquantidade;
  //   if (unitTotal >= estoque) {
  //     toast("Não há estoque suficiente deste produto para adição.", {
  //       type: "error",
  //       autoClose: 1000,
  //       position: "top-left",
  //     });
  //     return;
  //   }
  //   setUnidades((prev) => ({
  //     ...prev,
  //     [id]: { uquantidade: prev[id].uquantidade + 1 },
  //   }));
  // };
  // const handleDecrement = (id: number) => {
  //   setUnidades((prev) => ({
  //     ...prev,
  //     [id]: { uquantidade: Math.max(1, prev[id].uquantidade - 1) },
  //   }));
  // };
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  //  const sortedGroupedProducts = groupedProducts.sort((a, b) => a.preco - b.preco);
  {
    /* 
  sortedGroupedProducts = sortedGroupedProducts.sort(
    (a, b) => new Date(b.update).getTime() - new Date(a.update).getTime()
  );  
  */
  }
  //const productsToDisplay = sortedGroupedProducts.slice(startIndex, endIndex);
  const productsToDisplay = groupedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(groupedProducts.length / ITEMS_PER_PAGE);
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const onIdSelect = (product_id: number, id_produto: number) => {
    const existingItem = idSubmit.find(
      (item) => item.product_id === product_id && item.id_produto === id_produto
    );

    if (existingItem) {
      // Remove o item do array
      setIdSubmit(idSubmit.filter((item) => item !== existingItem));
    } else {
      // Adiciona o item ao array
      setIdSubmit([...idSubmit, { product_id, id_produto }]);
    }
  };

  const onSubmit = (id_product: number | string) => {
    const filterItem = idSubmit.filter((item) => item.product_id == id_product);
    const my_id = userData[0].id;
    // voltar aqui!
    api
      .post(`api/add/carrinho/${my_id}/`, {
        nome_usuario: my_id,
        id_produto: filterItem,
        //quantidade: unidades[id_product].uquantidade,
        quantidade: 1,
      })
      .then((response) => {
        if (response.data.status === "sucesso") {
          toast.success(response.data.msg || "Produto adicionado ao carrinho!");
          setLojaCarrinho(response.data.dados);
        } else {
          toast.error(
            response.data.msg || "Erro ao adicionar o produto ao carrinho."
          );
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.msg ||
            "Erro ao adicionar o produto ao carrinho."
        );
      });
  };

  useEffect(() => {
    if (products && products.length > 0) {
      // Cria um novo objeto de unidades
      const newUnidades = products.reduce((acc, product) => {
        acc[product.id] = { uquantidade: 1 };
        return acc;
      }, {} as UnidadesType);

      // Só atualiza o estado se for realmente diferente do estado atual
      if (JSON.stringify(newUnidades) !== JSON.stringify(unidades)) {
        setUnidades(newUnidades);
      }
    }
  }, [products, unidades]);

  const realFormatado = (value: number) => {
    if (value === null) {
      value = 0;
    }
    const formatValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    return formatValue;
  };

  useEffect(() => {
    // Atualizar lojaCarrinho com `ref`
    let productComRef = productsToDisplay.map((item) => {
      const produtoRelacionado = dataProductLoja.find(
        (produto) => produto.codigo === item.codigo
      );
      return produtoRelacionado
        ? { ...item, ref: produtoRelacionado.ref }
        : item;
    });

    // Atualizar imgProduct com `ref`
    const imgProductComRef = imgProduct.map((img) => {
      const produtoRelacionado = dataProductLoja.find(
        (produto) => produto.codigo === img.id_produto
      );
      return produtoRelacionado ? { ...img, ref: produtoRelacionado.ref } : img;
    });

    productComRef = productComRef.map((item) => {
      if (item.produto && item.produto.toLowerCase() !== "produto") {
        return { ...item, principal: true };
      }
      return { ...item, principal: false };
    });

    // Atualizar o estado apenas se houver mudanças
    {
      /* 
    if (JSON.stringify(productsToDisplay) != JSON.stringify(productComRef)) {
      setLojaCarrinho(productComRef);
    }

    if (JSON.stringify(imgProduct) != JSON.stringify(imgProductComRef)) {
      setImgProduct(imgProductComRef);
    }
      */
    }
    const isProductsChanged = productsToDisplay.some(
      (item, index) =>
        item.codigo !== productComRef[index]?.codigo ||
        item.ref !== productComRef[index]?.ref
    );

    const isImgChanged = imgProduct.some(
      (img, index) =>
        img.id_produto !== imgProductComRef[index]?.id_produto ||
        img.ref !== imgProductComRef[index]?.ref
    );

    // Atualizar o estado apenas se houver mudanças
    if (isProductsChanged) {
      setLojaCarrinho(productComRef);
    }

    if (isImgChanged) {
      setImgProduct(imgProductComRef);
    }
  }, [
    lojaCarrinho,
    imgProduct,
    dataProductLoja,
    setImgProduct,
    setLojaCarrinho,
    productsToDisplay,
  ]);

  return (
    <>
      <Main style={{ backgroundColor: isConfigSite.body }}>
        <NavSite searchTerm={setSearchTerm} />

        {/* Hero Section with improved spacing */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Descubra Nossos Produtos
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encontre os melhores calçados com qualidade e estilo
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Products Grid with modern layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsToDisplay?.length ? (
              productsToDisplay.map((product) => (
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white rounded-full shadow-sm"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <Carousel className="w-full">
                      <CarouselContent className="flex items-center">
                        {imgProduct
                          .filter((img) => img.ref === product.ref)
                          .map((img) => (
                            <CarouselItem>
                              <button
                                onClick={() => setZoomImg(img.url)}
                                className="w-full"
                              >
                                <img
                                  src={img.url}
                                  alt={product.produto}
                                  className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </button>
                            </CarouselItem>
                          ))}
                      </CarouselContent>

                      {imgProduct.some((img) => img.ref === product.ref) && (
                        <>
                          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-0 shadow-sm" />
                          <CarouselNext className="right-2 bg-white/80 hover:bg-white border-0 shadow-sm" />
                        </>
                      )}
                    </Carousel>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Size Selection */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Tamanhos:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.coresETamanhos
                          .slice()
                          .sort((a, b) =>
                            String(a.tamanho).localeCompare(
                              String(b.tamanho),
                              undefined,
                              { numeric: true, sensitivity: "base" }
                            )
                          )
                          .map((item) => (
                            <button
                              onClick={() =>
                                onIdSelect(product.id, item.id_product_loja)
                              }
                              className={`
                                h-8 w-8 rounded-full text-xs font-medium transition-all duration-200
                                ${
                                  idSubmit.some(
                                    (iditem) =>
                                      iditem.id_produto == item.id_product_loja
                                  )
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }
                              `}
                            >
                              {item.tamanho}
                            </button>
                          ))}
                      </div>
                    </div>

                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.produto}
                    </CardTitle>

                    <CardDescription className="text-gray-500 mb-3">
                      {product.marca}
                    </CardDescription>

                    {/* Rating (placeholder) */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          {realFormatado(product.preco * 1.2)}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          -17%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {realFormatado(product.preco)}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 space-y-3 flex flex-col">
                    {isAuthenticated ? (
                      <>
                        {idSubmit.some(
                          (item) => item.product_id == product.id
                        ) ? (
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors duration-200"
                            onClick={() => onSubmit(product.id)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                        ) : null}
                      </>
                    ) : (
                      <Link to="/login/" className="w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors duration-200">
                          Fazer Login
                        </Button>
                      </Link>
                    )}

                    <Link
                      to="/detalhes/"
                      state={{
                        data: product,
                        img: imgProduct.filter((im) => im.ref == product.ref),
                      }}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-200"
                      >
                        Ver Detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar sua pesquisa ou navegue por nossas categorias
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modern Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                className="px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Anterior
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className="w-10 h-10 rounded-lg"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Próxima
              </Button>
            </div>
          )}
        </div>

        {/* Image Zoom Modal */}
        {zoomImg && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setZoomImg(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={zoomImg}
                alt="Product zoom"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <Button
                onClick={() => setZoomImg(null)}
                variant="outline"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <FooterSite style={{ backgroundColor: isConfigSite.footer }} />
      </Main>
    </>
  );
}
