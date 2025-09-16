import { useEffect, useState } from "react";
import { Nav } from "../../components/nav";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TableBaseProduct } from "./tableProducts";
import { useData } from "../../components/context";
import { ModalImportProduct } from "./modalimport";
import { ModalImage } from "./modalimage";
import {
  CondicionalType,
  ImgProductType,
  ProductFormData,
  ProductType,
  ProdutoCondicional,
} from "../../components/types";
import { TableClientCondicional } from "./modalcond";
import { TableCondicionais } from "./condicionais";
import { ModalCreateProduct } from "./modalCreateProduct";

const infoSendSchema = z.object({
  ref: z.string().min(1, "Referência é obrigatória"),
  loja: z.boolean(),
  marca: z.string().min(1, "Marca é obrigatória"),
  codigo: z.string().min(1, "Código é obrigatório"),
  tamanho: z.string().min(1, "Tamanho é obrigatório"),
  preco: z.string().min(1, "Preço é obrigatório"),
  custo: z.string().min(1, "Custo é obrigatório"),
  estoque: z.number().min(1, "Estoque é obrigatório"),
  produto: z.string().min(1, "Nome do produto é obrigatório"),
  cor: z.string(),
  descricao: z.string(),
  //sequencia: z.string(),
});

type infoSendSchema = z.infer<typeof infoSendSchema>;

export function Produtos() {
  const { dataProduct, setProduct, imgProduct, setImgProduct } = useData() as {
    dataProduct: ProductType[];
    setProduct: React.Dispatch<React.SetStateAction<ProductType[]>>;
    imgProduct: ImgProductType[];
    setImgProduct: React.Dispatch<React.SetStateAction<ImgProductType[]>>;
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });

  const [isModalCond, setModalCond] = useState(false);
  const [loading, setLoading] = useState(false);
  const [condicionais, setCondicional] = useState<CondicionalType[]>([]);
  const [produtoCondicional, setProdutoCondicional] = useState<
    ProdutoCondicional[]
  >([]);
  const [isPage, setPage] = useState(1);
  const [isOpenCreateObject, setCreateObject] = useState(false);
  //const [valueUpdate, setValueUpdate] = useState(0);
  const [isModalImport, setModalImport] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ProductFormData>({
    ref: "",
    loja: false,
    marca: "",
    codigo: "",
    tamanho: "",
    preco: "",
    custo: "",
    estoque: 0,
    produto: "",
    cor: "",
    descricao: "",
    // sequencia: "",
  });

  const [isImgOpen, setImgOpen] = useState(false);

  const closeModalImg = () => {
    setImgOpen(!isImgOpen);
  };
  const dataHeaderProduct = [
    "produto",
    "marca",
    "tamanho",
    "codigo",
    "ref",
    "preco",
    "custo",
    "estoque",
  ];

  const openModalImport = () => {
    setModalImport(!isModalImport);
  };

  const openModal = () => {
    setCreateObject(!isOpenCreateObject);
  };

  const notifySuccess = (text: string) =>
    toast.success(text, {
      theme: "light",
    });

  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "light",
    });

  function handleFilterProduct(data: infoSendSchema) {
    setLoading(true);
    const sendNewProduct = async () => {
      try {
        const response = await toast.promise(api.post("api/produtos/", data), {
          pending: {
            render: "Carregando...",
            autoClose: 3000,
          },
          success: {
            render: "Dados enviado com sucesso!",
            autoClose: 1000,
          },
          error: {
            render: "Erro ao enviar os dados...",
            autoClose: 1500,
          },
        });
        const newDataResp = response.data;
        const alertView = newDataResp["msg"];
        const statusApi = newDataResp["status"];
        //const newData = newDataResp["dados"];
        const productsData = newDataResp["dados"];
        if (statusApi == "erro") {
          notifyError(alertView);
        } else if (statusApi == "sucesso") {
          //setProduct((prevDataProduct) => [...prevDataProduct, formattedData]);
          const formatedProducts = productsData.map((product: ProductType) => ({
            ...product,
            preco: product.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            custo: product.custo.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          }));
          setProduct(formatedProducts);
          notifySuccess(alertView);
        }
      } catch (error) {
        notifyError("Houve algum erro na obtenção dos dados.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    sendNewProduct();
  }

  function handleUpdateEstoque(
    valueCodigo: string,
    value: number,
    produto: string
  ) {
    setLoading(true);

    const sendUpdateEstoque = async () => {
      try {
        const response = await api.put("api/produtos/", {
          newEstoque: value,
          codigo: valueCodigo,
          produto: produto,
        });
        const dataResp = response.data;
        const status = dataResp["status"];
        if (status == "erro") {
          const msg = dataResp["msg"];
          notifyError(msg);
        } else {
          const updateEstoque = dataResp["updateValue"];
          setProduct((prevProducts) =>
            prevProducts.map((product) =>
              product.codigo === valueCodigo
                ? { ...product, estoque: updateEstoque, produto: produto }
                : product
            )
          );
        }
      } catch (error) {
        notifyError(`Erro ao atualizar o estoque.  ${error}`);
      } finally {
        setLoading(false);
      }
    };

    sendUpdateEstoque();
  }

  useEffect(() => {
    const getCondicional = async () => {
      try {
        const response = await api.get("api/adm/condicional/");
        const status = response.data.status;
        if (status == "sucesso") {
          const dados = response.data.dados;
          const produtos = response.data.dados_produtos;
          setCondicional(dados);
          setProdutoCondicional(produtos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCondicional();
  }, [setCondicional, setProdutoCondicional]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brown-50">
        <Nav />
        <ToastContainer
          position="top-right"
          toastClassName="!bg-white !text-brown-800 border border-brand-200 shadow-lg"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-brown-800 mb-2">
                  {isPage === 1 ? "Gestão de Produtos" : "Condicionais"}
                </h1>
                <p className="text-brown-600">
                  {isPage === 1
                    ? "Cadastre e gerencie seu estoque de produtos"
                    : "Configure condicionais de produtos"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isPage === 1 && (
                  <>
                    <Button
                      className="bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 gap-2 px-4 py-2"
                      onClick={() => {
                        openModal();
                        setIsUpdate(false);
                        setDataUpdate({
                          ref: "",
                          loja: false,
                          marca: "",
                          codigo: "",
                          tamanho: "",
                          preco: "",
                          custo: "",
                          estoque: 0,
                          produto: "",
                          cor: "",
                          descricao: "",
                          //  sequencia: "",
                        });
                      }}
                    >
                      + Novo Produto
                    </Button>

                    <Button
                      className="bg-brown-600 hover:bg-brown-700 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 gap-2 px-4 py-2"
                      onClick={openModalImport}
                    >
                      📥 Importar
                    </Button>
                  </>
                )}

                {isPage === 2 && (
                  <Button
                    className="bg-brown-600 hover:bg-brown-700 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 gap-2 px-4 py-2"
                    onClick={() => {
                      setModalCond(!isModalCond);
                    }}
                  >
                    {isModalCond ? "📋 Condicionais" : "+ Nova Condicional"}
                  </Button>
                )}

                <Button
                  className="bg-brown-500 hover:bg-brown-600 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 gap-2 px-4 py-2"
                  onClick={() => {
                    if (isPage === 1) {
                      setPage(2);
                    } else {
                      setPage(1);
                      setModalCond(false);
                    }
                  }}
                >
                  {isPage === 1 ? "📊 Condicionais" : "📦 Estoque"}
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
            {isPage === 2 && (
              <>
                {isModalCond ? (
                  <div className="p-6">
                    <TableClientCondicional setCondicional={setCondicional} />
                  </div>
                ) : (
                  <div className="p-6">
                    <TableCondicionais
                      condicionais={condicionais}
                      produtos={produtoCondicional}
                      setProdutosCondicionais={() => setProdutoCondicional}
                    />
                  </div>
                )}
              </>
            )}

            {isPage === 1 && (
              <TableBaseProduct
                dataBody={dataProduct}
                dataHeader={dataHeaderProduct}
                handleUpdate={handleUpdateEstoque}
                notifySuccess={notifySuccess}
                notifyError={notifyError}
                setUpdate={setIsUpdate}
                setIsOpen={openModal}
                setDataUpdate={setDataUpdate}
                imgProduct={imgProduct}
                setImgProduct={setImgProduct}
                isImgOpen={isImgOpen}
                setImgOpen={setImgOpen}
              />
            )}
          </div>
        </main>

        {/* Modais */}
        <ModalCreateProduct
          isOpen={isOpenCreateObject}
          closeModal={openModal}
          descriptionModal={
            !isUpdate
              ? "Preencha todos os campos para cadastrar o produto."
              : "Preencha todos os campos para atualizar os produtos."
          }
          titleModal={
            !isUpdate ? "Cadastrando o produto" : "Atualizando o produto."
          }
          handleFilterProduct={handleFilterProduct}
          handleSubmit={handleSubmit}
          register={register}
          update={isUpdate}
          dataUpdate={dataUpdate}
          setValue={setValue}
          watch={watch}
          formStateErrors={errors}
        />

        <ModalImportProduct
          isOpen={isModalImport}
          closeModal={openModalImport}
          descriptionModal="Importação de produtos"
          titleModal="Utilize o modelo de importação para garantir a importação correta."
          notifyError={notifyError}
          notifySuccess={notifySuccess}
        />

        <ModalImage
          isOpen={isImgOpen}
          closeModal={closeModalImg}
          titleModal="Adicione imagens ao produto"
          descriptionModal="Faça upload antes de enviar o link."
          notifyError={notifyError}
          notifySuccess={notifySuccess}
          imgProduct={imgProduct}
          dataUpdate={dataUpdate}
        />
      </div>
    </>
  );
}
