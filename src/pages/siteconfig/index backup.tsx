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
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../services/api";
import { Minus, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Link } from "react-router-dom";
import { ModalConfigSite } from "./modalConfig";
import { ModalConfigCapa } from "./modalcapa";

type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

interface ProductGroup {
  ref: string;
  produto: string;
  marca: string;
  preco: number;
  id: number;
  estoque: number;
  codigo: string;
  cadastro: Date;
  //custo: number;
  coresETamanhos: Array<{
    //cor: string;
    tamanho: string | number;
    estoque: number;
    id_product_loja: number;
  }>;
}
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
  cadastro: Date;
  //cor: string;
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
const ITEMS_PER_PAGE = 9;
export function SiteConfig() {
  const {
    isConfigSite,
    dataProductLoja,
    userData,
    setLojaCarrinho,
    isAuthenticated,
    lojaCarrinho,
    imgProduct,
    setImgProduct,
  } = useData() as {
    lojaCarrinho: ProductCarrinho[];
    imgProduct: imgType[];
    dataProductLoja: Product[];
    isAuthenticated: boolean;
    setImgProduct: (data: imgType[]) => void;
    setLojaCarrinho: (data: ProductCarrinho[]) => void;
    userData: userDataType[];
    isConfigSite: ConfigSiteType;
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalCapa, setModalCapa] = useState(false);
  const [idSubmit, setIdSubmit] = useState<TypeIdSubmit[]>([]);
  const [isModalSite, setModalSite] = useState(false);
  const products = dataProductLoja;
  const filteredProducts = products.filter((product) =>
    product.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const groupedProducts = Object.values(
    filteredProducts.reduce((acc, product) => {
      const { ref, produto, marca, preco, codigo, id, estoque, cadastro } =
        product;
      if (!acc[ref]) {
        acc[ref] = {
          ref,
          produto,
          marca,
          preco,
          codigo,
          id,
          estoque,
          cadastro,
          coresETamanhos: [],
        };
      }
      // Adiciona as informações específicas (cor, tamanho, estoque)
      acc[ref].coresETamanhos.push({
        //cor: product.cor,
        tamanho: product.tamanho,
        estoque: product.estoque,
        id_product_loja: product.id,
      });

      return acc;
    }, {} as Record<string, ProductGroup>)
  );

  const [unidades, setUnidades] = useState<UnidadesType>(
    products.reduce((acc, product) => {
      acc[product.id] = { uquantidade: 1 };
      return acc;
    }, {} as UnidadesType)
  );
  const handleIncrement = (id: number, estoque: number) => {
    const unitTotal = unidades[id].uquantidade;
    if (unitTotal >= estoque) {
      toast("Não há estoque suficiente deste produto para adição.", {
        type: "error",
        autoClose: 1000,
        position: "top-left",
      });
      return;
    }
    setUnidades((prev) => ({
      ...prev,
      [id]: { uquantidade: prev[id].uquantidade + 1 },
    }));
  };
  const handleDecrement = (id: number) => {
    setUnidades((prev) => ({
      ...prev,
      [id]: { uquantidade: Math.max(1, prev[id].uquantidade - 1) },
    }));
  };
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  //const sortedGroupedProducts = groupedProducts.sort(
  // (a, b) => a.cadastro.getTime() - b.cadastro.getTime()
  //);
  const sortedGroupedProducts = groupedProducts.sort((a, b) => {
    const dateA = a.cadastro ? new Date(a.cadastro).getTime() : 0;
    const dateB = b.cadastro ? new Date(b.cadastro).getTime() : 0;

    return dateB - dateA;
  });
  const productsToDisplay = sortedGroupedProducts.slice(startIndex, endIndex);
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
      setUnidades(
        products.reduce((acc, product) => {
          acc[product.id] = { uquantidade: 1 };
          return acc;
        }, {} as UnidadesType)
      );
    }
  }, [products]);

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
    const productComRef = productsToDisplay.map((item) => {
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

    // Atualizar o estado apenas se houver mudanças
    if (JSON.stringify(productsToDisplay) !== JSON.stringify(productComRef)) {
      setLojaCarrinho(productComRef);
    }

    if (JSON.stringify(imgProduct) !== JSON.stringify(imgProductComRef)) {
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
  // bg white caso precise.
  return (
    <>
      <Main style={{ backgroundColor: isConfigSite.body }}>
        <NavSite />
        <div className="flex">
          <div className="flex mt-2 ml-auto gap-2">
            <Button className="h-auto bg-purple-600 hover:bg-purple-800">
              <Link to="/config/sobrenos/">Sobre Nós</Link>
            </Button>
            <Button
              className="h-auto bg-gray-600 hover:bg-gray-800"
              onClick={() => setModalCapa(true)}
            >
              Editar Capa
            </Button>
            {isModalCapa && (
              <ModalConfigCapa
                titleModal="Editar Capa"
                descriptionModal="Escolha as imagens para sua capa."
                isOpen={isModalCapa}
                closeModal={() => setModalCapa(false)}
              />
            )}
            <Button
              className="h-auto bg-blue-800 hover:bg-blue-900"
              onClick={() => setModalSite(true)}
            >
              Layout
            </Button>
            {isModalSite && (
              <ModalConfigSite
                titleModal="Configurando Site"
                descriptionModal="Selecione as cores do site."
                isOpen={isModalSite}
                closeModal={() => setModalSite(!isModalSite)}
              />
            )}
          </div>
        </div>
        <div className="mx-auto py-8 flex flex-col gap-4">
          {/* Lista de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsToDisplay?.length ? (
              productsToDisplay.map((product) => (
                <Card
                  key={product.codigo}
                  className="p-4 border-none bg-gray-50"
                >
                  <CardHeader className="p-0">
                    <Carousel className="mr-12 ml-12 mt-4">
                      <CarouselContent className="flex items-center text-center">
                        {imgProduct
                          .filter((img) => img.ref === product.ref)
                          .map((img) => (
                            <CarouselItem key={img.id_produto}>
                              <img src={img.url} className="w-full h-[300px]" />
                            </CarouselItem>
                          ))}
                      </CarouselContent>

                      {imgProduct.some((img) => img.ref === product.ref) && (
                        <>
                          <CarouselPrevious className="bg-black text-white" />
                          <CarouselNext className="bg-black text-white" />
                        </>
                      )}
                    </Carousel>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 mb-1 flex justify-center gap-2">
                      {product.coresETamanhos
                        .slice()
                        .sort((a, b) =>
                          String(a.tamanho).localeCompare(
                            String(b.tamanho),
                            undefined,
                            {
                              numeric: true,
                              sensitivity: "base",
                            }
                          )
                        )
                        .map((item, index) => (
                          <span
                            key={index}
                            onClick={() =>
                              onIdSelect(product.id, item.id_product_loja)
                            }
                            className={`flex justify-center cursor-pointer ${
                              idSubmit.some(
                                (iditem) =>
                                  iditem.id_produto == item.id_product_loja
                              )
                                ? "bg-app-bg-color-text text-white"
                                : "bg-[#D9D9D9]"
                            } font-bold w-[28px] py-1 px-1 rounded-full text-[12px]`}
                          >
                            {item.tamanho}
                          </span>
                        ))}
                    </div>
                    <CardTitle className="text-lg font-bold">
                      {product.produto}
                    </CardTitle>
                    <CardDescription>{product.marca}</CardDescription>
                    <div className="flex justify-center gap-8 font-semibold my-2">
                      <span className="line-through text-red-500">
                        {realFormatado(product.preco * 1.2)}
                      </span>
                      <span>{realFormatado(product.preco)}</span>
                    </div>

                    <div className="flex items-center justify-center font-smibold my-2 hidden">
                      <Minus
                        className="cursor-pointer text-red-700"
                        onClick={() => handleDecrement(product.id)}
                      />
                      <Input
                        key={product.id}
                        min="0"
                        type="number"
                        readOnly={true}
                        value={
                          unidades[product.id]
                            ? unidades[product.id].uquantidade
                            : 1
                        }
                        className="w-auto text-center"
                      />
                      <Plus
                        className="cursor-pointer text-green-700"
                        onClick={() =>
                          handleIncrement(product.id, product.estoque)
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full">
                      {isAuthenticated ? (
                        <>
                          {idSubmit.some(
                            (item) => item.product_id == product.id
                          ) ? (
                            <Button
                              className="w-full bg-blue-600 bg-app-bg-color hover:bg-app-bg-color-text"
                              //onClick={() => onSubmit(product.id)}
                              onClick={() => onSubmit(product.id)}
                            >
                              Adicionar ao Carrinho
                            </Button>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <Link to="/login/">
                          <Button className="w-full bg-green-600 hover:bg-green-600 text-white">
                            Logar
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-lg">Nenhum produto encontrado</p>
            )}
          </div>

          {/* Controles de paginação */}
          <div className="flex justify-center mt-4 text-black">
            {totalPages > 1 && (
              <>
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 mx-2">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Próxima
                </Button>
              </>
            )}
          </div>
        </div>
        <ToastContainer />
        <FooterSite style={{ backgroundColor: isConfigSite.footer }} />
      </Main>
    </>
  );
}
