import { Main } from "../../components/main";
import { FooterSite, NavSite } from "../../components/navsite";
import { useData } from "../../components/context";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { MapPin, Minus, Phone, Plus, User } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";
type ProductCarrinho = {
  produto: string;
  nome_usuario: string;
  id_produto: number;
  quantidade: number;
  marca: string;
  preco: number;
  codigo: string;
  // link: string;
};

const infoSendSchema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  email: z.string().min(1, "Campo obrigatório"),
  cpf: z.string().min(1, "Campo obrigatório"),
  telefone: z.string().min(1, "Campo obrigatório"),
  endereco: z.string().min(1, "Campo obrigatório"),
  cidade: z.string().min(1, "Campo obrigatório"),
  estado: z.string().min(1, "Campo obrigatório"),
  cep: z.string().min(1, "Campo obrigatório"),
  numeroCartao: z.string().min(1, "Campo obrigatório"),
  nomeTitular: z.string().min(1, "Campo obrigatório"),
  expiraMes: z.string().min(1, "Campo obrigatório"),
  expiraAno: z.string().min(1, "Campo obrigatório"),
  cvv: z.string().min(1, "Campo obrigatório"),
  parcelas: z.string().min(1, "Campo obrigatório"),
  total: z.string(),
  usuario: z.string(),
  item: z.array(
    z.object({
      codigo: z.string(),
      id_produto: z.number(),
      marca: z.string(),
      nome_usuario: z.string(),
      pk: z.number(),
      preco: z.number(),
      produto: z.string(),
      update: z.string(),
      quantidade: z.number(),
    })
  ),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;
type userDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

type lojaCarrinhoType = {
  codigo: string;
  id_produto: number;
  marca: string;
  nome_usuario: string;
  id: number;
  preco: number;
  produto: string;
  update: string;
  quantidade: number;
  estoque: number;
  ref: string;
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
  //cor: string;
};

type imgProductType = {
  url: string;
  id_produto: string;
  ref: string;
};

export function CarrinhoPage() {
  const notifyError = (text: string | number) => {
    toast(text, { type: "error", position: "top-left", autoClose: 2000 });
  };

  const navigate = useNavigate();
  const {
    setLojaCarrinho,
    lojaCarrinho,
    imgProduct,
    dataProductLoja,
    setImgProduct,
  } = useData() as {
    lojaCarrinho: lojaCarrinhoType[];
    imgProduct: imgProductType[];
    setLojaCarrinho: (data: lojaCarrinhoType[]) => void;
    dataProductLoja: Product[];
    setImgProduct: (data: imgProductType[]) => void;
  };

  useEffect(() => {
    // Atualizar lojaCarrinho com `ref`
    const lojaCarrinhoComRef = lojaCarrinho.map((item) => {
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
    if (JSON.stringify(lojaCarrinho) !== JSON.stringify(lojaCarrinhoComRef)) {
      setLojaCarrinho(lojaCarrinhoComRef);
    }

    if (JSON.stringify(imgProduct) !== JSON.stringify(imgProductComRef)) {
      setImgProduct(imgProductComRef);
    }
  }, [lojaCarrinho, imgProduct, dataProductLoja]);

  const [states, setStates] = useState([]);
  const [searchState, setSearchState] = useState("");
  const [filteredStates, setFilteredStates] = useState(states);
  const { userData } = useData() as { userData: userDataType[] };
  //const dataLojaCarrinho: ProductCarrinho[] = lojaCarrinho;
  const [isPaid, setIsPaid] = useState<ProductCarrinho[]>([]);
  const [isCart, setIsCart] = useState(1);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msgApi, setMsgApi] = useState("");
  const [erroApi, setErroApi] = useState([]);
  const [telefone, setTelefone] = useState("");
  const [prevTelefone, setPrevTelefone] = useState("");
  const [isCpf, setCpf] = useState("");
  const [isNome, setNome] = useState("");
  const [isEmail, setEmail] = useState(false);

  const handleSearchState = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchState(searchTerm);
    setFilteredStates(
      states.filter(
        (state) =>
          state.label.toLowerCase().includes(searchTerm) ||
          state.value.toLowerCase().includes(searchTerm)
      )
    );
  };

  const formatarTelefone = (value: string) => {
    const currentValue = value;
    const numeros = currentValue.replace(/\D/g, "");
    if (numeros.length <= 2) {
      return `(${numeros}`;
    }
    if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }
    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
        7
      )}`;
    }
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7,
      11
    )}`;
  };

  const validarEmail = (valor: string) => {
    const padrao = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    //const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newValor = (valor || "").toString().trim();
    setEmail(padrao.test(newValor));
    //return padrao.test(newValor);
  };

  const handleChangeCpf = (e) => {
    const value = e.target.value;
    const cpf = value.replace(/\D/g, "");
    if (cpf.length <= 11) {
      setCpf(cpf);
    }
  };

  const handleChangeStep = (step: number) => {
    if (isNome.length < 4) {
      notifyError("Preencha o nome corretamente.");
      return;
    }
    if (!isEmail) {
      notifyError("Digite um e-mail válido. ");
      return;
    }
    if (isCpf.length < 11) {
      notifyError("Preencha o CPF corretamente.");
      return;
    }
    if (telefone.length < 14) {
      notifyError("Preencha o telefone corretamente.");
      return;
    }

    setStep(step);
  };
  const handleChangeTelefone = (e) => {
    const value = e.target.value;
    const numeros = value.replace(/\D/g, "");
    const isDeleting = value.length < prevTelefone.length;
    if (!isDeleting) {
      setTelefone(formatarTelefone(numeros));
    } else {
      setTelefone(value);
    }
    setPrevTelefone(value);
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });

  useEffect(() => {
    setValue("item", isPaid || []);
  }, [isPaid, setValue]);

  function handleFilterData(data: infoSendSchema) {
    const sendNewPre = async () => {
      try {
        setLoading(true);
        const response = await toast.promise(api.post("api/pagar-me/", data), {
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
        const newData = response.data;
        const status = newData["status"];
        const dataMsg = newData["msg"];
        if (status === "sucesso") {
          const dataCart = newData["dados"];
          const dataMsgErro = newData["erros"];
          setMsgApi(dataMsg);
          setLojaCarrinho(dataCart);
          if (dataMsgErro) {
            setErroApi(dataMsgErro);
          } else {
            setErroApi([]);
          }
        } else {
          const dataMsgErro = newData["erros"];
          setErroApi(dataMsgErro);
          setMsgApi(dataMsg);
        }
        setIsCart(3);
      } catch (error) {
        toast("Houve algum erro na obtenção dos dados.", { type: "error" });
      } finally {
        setLoading(!loading);
      }
    };
    sendNewPre();
  }

  const handleDecrement = (id_produto: number) => {
    const produto = lojaCarrinho.find((item) => item.id_produto === id_produto);
    if (!produto) return;

    const { quantidade, preco, nome_usuario, pk } = produto;
    const newQtde = quantidade - 1;

    if (newQtde < 1) {
      removeItem(pk, nome_usuario, id_produto);
    } else {
      const valorUnit = preco / quantidade;
      const valorUpdate = valorUnit * newQtde;
      const updateProduto = (prev: any) =>
        prev.map((item) =>
          item.id_produto === id_produto
            ? { ...item, quantidade: newQtde, preco: valorUpdate }
            : item
        );
      setLojaCarrinho(updateProduto);
      setIsPaid(updateProduto);
    }
  };

  const handleIncrement = (id_produto: number) => {
    const produto = lojaCarrinho.find((item) => item.id_produto === id_produto);
    if (!produto) return;

    const { quantidade, preco, nome_usuario, pk, estoque } = produto;
    const newQtde = quantidade + 1;

    if (newQtde < 1) {
      removeItem(pk, nome_usuario, id_produto);
    } else {
      if (newQtde > estoque) {
        toast(
          "Não há estoque suficiente deste produto para adicionar mais unidades.",
          { type: "error", autoClose: 1000, position: "top-left" }
        );
        return;
      }
      const valorUnit = preco / quantidade;
      const valorUpdate = valorUnit * newQtde;
      const updateProduto = (prev: any) =>
        prev.map((item) =>
          item.id_produto === id_produto
            ? { ...item, quantidade: newQtde, preco: valorUpdate }
            : item
        );
      setLojaCarrinho(updateProduto);
      setIsPaid(updateProduto);
    }
  };
  const total = lojaCarrinho.reduce((acc, product) => acc + product.preco, 0);
  // const formatedTotal = Math.round(total).toString().replace(/\D/g, "");
  const formatedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

  const total12x = total / 12;
  const totalFormatado12x = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total12x);

  const totalFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

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

  const inputCheck = (id_produto: number, checked: boolean) => {
    const produto = lojaCarrinho.find((item) => item.id_produto === id_produto);
    if (produto) {
      if (checked) {
        setIsPaid((prevState) => [...prevState, produto]);
      } else {
        setIsPaid((prevState) =>
          prevState.filter((item) => item.id_produto !== id_produto)
        );
      }
    }
  };

  const totalPaid = isPaid.reduce((acc, product) => acc + product.preco, 0);

  const handleChangePaid = () => {
    if (isPaid.length >= 1) {
      setIsCart(2);
    } else {
      if (lojaCarrinho.length < 1) {
        navigate("/loja/");
      } else {
        toast("Selecione os produtos para continuar!", {
          type: "error",
          position: "top-left",
          autoClose: 500,
        });
      }
    }
  };

  const sendRemoveItem = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("api/remove/item/sacola/", data);
      const newData = response.data;
      const status = newData["status"];
      const dataMsg = newData["msg"];
      if (status === "sucesso") {
        const dataCart = newData["dados"];
        toast(dataMsg, { type: "success", position: "top-left" });
        setLojaCarrinho(dataCart);
        let id_produto = 0;
        data.forEach((value: number, key) => {
          id_produto = value;
          const produto = lojaCarrinho.find(
            (item) => item.id_produto == id_produto
          );
          if (produto) {
            setIsPaid((prevState) =>
              prevState.filter((item) => item.id_produto != id_produto)
            );
          }
        });
      } else {
        toast(dataMsg, { type: "error", position: "top-left" });
      }
    } catch (error) {
      toast("Houve algum erro na obtenção dos dados.", { type: "error" });
    } finally {
      setLoading(!loading);
    }
  };

  const removeItem = (id_cart, usuario_name, id_produto) => {
    const dataApi = new FormData();
    dataApi.append("id_cart", id_cart);
    dataApi.append("usuario", usuario_name);
    dataApi.append("id_produto", id_produto);
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-start">
          <p>Tem certeza que deseja remover este item?</p>
          <div className="flex gap-2 mt-2">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full"
              onClick={() => {
                sendRemoveItem(dataApi);
                closeToast();
              }}
            >
              Sim
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full"
              onClick={closeToast}
            >
              Não
            </Button>
          </div>
        </div>
      ),
      {
        autoClose: 2000,
      }
    );
  };
  useEffect(() => {
    if (totalPaid === 0) {
      setIsCart(1);
    }
  }, [totalPaid]);
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => response.json())
      .then((data) => {
        const stateList = data.map((state: any) => ({
          value: state.sigla,
          label: state.nome,
        }));
        setStates(stateList);
      });
  }, []);
  return (
    <>
      <Main className="bg-white">
        <NavSite></NavSite>
        <ToastContainer />
        <div className="relative text-black">
          <>
            <div
              className={`grid mt-4 m-2 sm:space-x-4 space-y-4 sm:space-y-0  ${
                lojaCarrinho.length < 1
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {lojaCarrinho.length >= 1 ? (
                <>
                  <div className="col-span-1">
                    <div className="bg-[#D9D9D9] flex flex-col sm:space-y-8  sm:p-8">
                      <h3>Sacola</h3>
                      {lojaCarrinho.map((produto) => (
                        <>
                          <div className="inline-flex space-x-8 justify-between  p-4">
                            <div>
                              <div className="w-full h-full flex items-center justify-center flex-shrink-0 space-x-4">
                                <div>
                                  <Input
                                    type="checkbox"
                                    //onClick={() => inputCheck(produto.id_produto)}
                                    onChange={(e) =>
                                      inputCheck(
                                        produto.id_produto,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </div>

                                {imgProduct.find(
                                  (img) => img?.ref === produto?.ref
                                ) && (
                                  <img
                                    className="object-cover sm:w-[165px] sm:h-[178px]"
                                    src={
                                      imgProduct.find(
                                        (img) => img.ref === produto.ref
                                      )?.url
                                    }
                                  />
                                )}
                              </div>
                            </div>
                            <div className="space-y-3 text-left">
                              <span className="text-[12px]">
                                {produto.produto.toLocaleUpperCase()},{" "}
                                {produto.marca}
                              </span>

                              <p className="space-x-8 text-app-text-color underline font-bold cursor-pointer text-[12px]">
                                <span
                                  className="cursor-pointer"
                                  onClick={() =>
                                    removeItem(
                                      produto.id,
                                      produto.nome_usuario,
                                      produto.id_produto
                                    )
                                  }
                                >
                                  Excluir
                                </span>
                                {/*<span>Comprar</span> */}
                              </p>
                            </div>
                            <div>
                              <div className="relative ">
                                <Input
                                  className="text-center h-[44px] w-[110px]"
                                  type="number"
                                  //defaultValue={produto.quantidade}
                                  value={produto.quantidade}
                                  readOnly={true}
                                />

                                <Plus
                                  onClick={() =>
                                    handleIncrement(produto.id_produto)
                                  }
                                  className="absolute text-green-600 cursor-pointer right-3 top-5 transform -translate-y-1/2 text-gray-400"
                                  size={15}
                                />
                                <Minus
                                  onClick={() =>
                                    handleDecrement(produto.id_produto)
                                  }
                                  className="absolute text-red-600 cursor-pointer left-3 top-5 transform -translate-y-1/2 text-gray-400"
                                  size={15}
                                />
                              </div>
                            </div>
                            <div>
                              <span>{realFormatado(produto.preco)}</span>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {isCart === 1 ? (
                <>
                  <div className="col-span-1">
                    <div className="bg-[#D9D9D9] flex flex-col p-2 space-y-6 w-auto">
                      <h3>Resumo da compra</h3>
                      <hr className="border-black"></hr>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Produto</span>
                          <span>{realFormatado(totalPaid)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frete</span>
                          <span>R$25,00</span>
                        </div>
                        <hr className="border-black"></hr>
                        <div>
                          <Button
                            className="w-full bg-[#615D5D] hover:bg-[#615D5D]"
                            onClick={handleChangePaid}
                          >
                            Continuar a compra
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : isCart === 2 ? (
                <>
                  <div className="col-span-1">
                    <div className="bg-[#D9D9D9] p-4">
                      <div className="max-w-full sm:max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                        <div className="space-x-2 space-y-4 mb-6">
                          <h2 className="text-2xl font-semibold text-center">
                            Formulário de Compra
                          </h2>
                          <div className="flex justify-between items-center border-b border-dashed">
                            <span>Valor total</span>
                            <span>{realFormatado(totalPaid + 25)}</span>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit(handleFilterData)}>
                          {/* Dados Pessoais */}
                          {isPaid?.map((item, index) => (
                            <div className="space-x-4 hidden" key={index}>
                              <Input
                                defaultValue={item.codigo}
                                {...register(`item.${index}.codigo` as const)}
                                placeholder="Código"
                              />
                              {errors.item?.[index]?.codigo && (
                                <span>{errors.item[index].codigo.message}</span>
                              )}
                              <span>PhCole</span>
                              <Input
                                defaultValue={item.quantidade}
                                type="number"
                                {...register(
                                  `item.${index}.quantidade` as const
                                )}
                              />
                              {errors.item?.[index]?.quantidade && (
                                <span className="text-red-500 text-sm">
                                  {errors.item[index].quantidade.message}
                                </span>
                              )}

                              <Input
                                defaultValue={item.id_produto}
                                type="number"
                                {...register(
                                  `item.${index}.id_produto` as const
                                )}
                                placeholder="ID Produto"
                              />
                              {errors.item?.[index]?.id_produto && (
                                <span>
                                  {errors.item[index].id_produto.message}
                                </span>
                              )}

                              <Input
                                defaultValue={item.marca}
                                {...register(`item.${index}.marca` as const)}
                                placeholder="Marca"
                              />
                              {errors.item?.[index]?.marca && (
                                <span>{errors.item[index].marca.message}</span>
                              )}

                              <Input
                                defaultValue={item.nome_usuario}
                                {...register(
                                  `item.${index}.nome_usuario` as const
                                )}
                                placeholder="Nome do Usuário"
                              />
                              {errors.item?.[index]?.nome_usuario && (
                                <span>
                                  {errors.item[index].nome_usuario.message}
                                </span>
                              )}

                              <Input
                                defaultValue={item.pk}
                                type="number"
                                {...register(`item.${index}.pk` as const)}
                                placeholder="PK"
                              />
                              {errors.item?.[index]?.pk && (
                                <span>{errors.item[index].pk.message}</span>
                              )}

                              <Input
                                defaultValue={item.preco}
                                {...register(`item.${index}.preco` as const)}
                                placeholder="Preço"
                              />
                              {errors.item?.[index]?.preco && (
                                <span>{errors.item[index].preco.message}</span>
                              )}

                              <Input
                                defaultValue={item.produto}
                                {...register(`item.${index}.produto` as const)}
                                placeholder="Produto"
                              />
                              {errors.item?.[index]?.produto && (
                                <span>
                                  {errors.item[index].produto.message}
                                </span>
                              )}

                              <Input
                                defaultValue={item.update}
                                {...register(`item.${index}.update` as const)}
                                placeholder="Data de Atualização"
                              />
                              {errors.item?.[index]?.update && (
                                <span>{errors.item[index].update.message}</span>
                              )}
                            </div>
                          ))}
                          {step === 1 && (
                            <>
                              <Input
                                value={userData[0].id}
                                {...register("usuario")}
                                className="hidden"
                              />

                              <div className="mb-4">
                                <Label
                                  htmlFor="nome"
                                  className="flex items-center space-x-2"
                                >
                                  <User size={20} />
                                  <span>Nome</span>
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Seu nome completo"
                                  className="mt-2 w-full"
                                  value={isNome}
                                  onInput={(e) => setNome(e.target.value)}
                                  {...register("nome")}
                                />
                                {errors.nome && (
                                  <span className="text-red-500 text-sm">
                                    {errors.nome.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor="email"
                                  className="flex items-center space-x-2"
                                >
                                  <User size={20} />
                                  <span>Email</span>
                                </Label>
                                <Input
                                  type="email"
                                  placeholder="Seu e-mail ex: meu@email.com"
                                  className="mt-2 w-full"
                                  onInput={(e) => validarEmail(e.target.value)}
                                  {...register("email")}
                                />
                                {errors.email && (
                                  <span className="text-red-500 text-sm">
                                    {errors.email.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor="cpf"
                                  className="flex items-center space-x-2"
                                >
                                  <User size={20} />
                                  <span>CPF</span>
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Seu CPF"
                                  className="mt-2 w-full"
                                  value={isCpf}
                                  onInput={handleChangeCpf}
                                  {...register("cpf")}
                                />
                                {errors.cpf && (
                                  <span className="text-red-500 text-sm">
                                    {errors.cpf.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor="telefone"
                                  className="flex items-center space-x-2"
                                >
                                  <Phone size={20} />
                                  <span>Telefone</span>
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Seu telefone"
                                  className="mt-2 w-full"
                                  value={telefone}
                                  onInput={handleChangeTelefone}
                                  {...register("telefone")}
                                />
                                {errors.telefone && (
                                  <span className="text-red-500 text-sm">
                                    {errors.telefone.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4 flex flex-col sm:flex-row mt-2">
                                <Button
                                  className="bg-app-bg-color hover:bg-gray-600 ml-auto text-app-text-color w-full sm:w-auto"
                                  onClick={() => handleChangeStep(2)}
                                  type="button"
                                >
                                  Próximo
                                </Button>
                              </div>
                            </>
                          )}

                          {step === 2 && (
                            <>
                              {/* Endereço */}
                              <div className="mb-4">
                                <Label
                                  htmlFor="endereco"
                                  className="flex items-center space-x-2"
                                >
                                  <MapPin size={20} />
                                  <span>Endereço </span>
                                  <span className="text-[10px]">
                                    (rua, bairro, numero)
                                  </span>
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Endereço de cobrança"
                                  className="mt-2 w-full"
                                  {...register("endereco")}
                                />
                                {errors.endereco && (
                                  <span className="text-red-500 text-sm">
                                    {errors.endereco.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="w-full sm:w-1/2">
                                  <Label htmlFor="estado">Estado</Label>
                                  {/*<Input
                                    type="text"
                                    className="mt-2 w-full"
                                    {...register("estado")}
                                  />*/}
                                  <Select
                                    onValueChange={(value) =>
                                      setValue("estado", value)
                                    }
                                  >
                                    <SelectTrigger className="w-full mt-2 h-auto">
                                      <SelectValue placeholder="Selecione o estado" />
                                    </SelectTrigger>
                                    <SelectContent
                                      style={{
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      <div className="relative top-0 p-2">
                                        <Input
                                          className="w-full h-8 px-2 border border-gray-300 rounded-md"
                                          placeholder="buscar estado..."
                                          value={searchState}
                                          onChange={handleSearchState}
                                          onKeyDown={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      {filteredStates.map((state) => (
                                        <SelectItem
                                          key={state.value}
                                          value={state.value}
                                        >
                                          {state.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.estado && (
                                    <span className="text-red-500 text-sm">
                                      {errors.estado.message}
                                    </span>
                                  )}
                                </div>

                                <div className="w-full sm:w-1/2">
                                  <Label htmlFor="cidade">Cidade</Label>
                                  <Input
                                    type="text"
                                    className="mt-2 w-full"
                                    {...register("cidade")}
                                  />
                                  {errors.cidade && (
                                    <span className="text-red-500 text-sm">
                                      {errors.cidade.message}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mb-4">
                                <Label htmlFor="cep">CEP</Label>
                                <Input
                                  type="text"
                                  className="mt-2 w-full"
                                  {...register("cep")}
                                />
                                {errors.cep && (
                                  <span className="text-red-500 text-sm">
                                    {errors.cep.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4 flex flex-col sm:flex-row justify-between mt-2">
                                <Button
                                  className="bg-gray-500 hover:bg-gray-900 text-app-text-color w-full sm:w-auto mb-2 sm:mb-0"
                                  onClick={() => setStep(step - 1)}
                                  type="button"
                                >
                                  Voltar
                                </Button>
                                <Button
                                  className="bg-app-bg-color hover:bg-gray-600 ml-auto text-app-text-color w-full sm:w-auto"
                                  onClick={() => setStep(step + 1)}
                                  type="button"
                                >
                                  Próximo
                                </Button>
                              </div>
                            </>
                          )}

                          {step === 3 && (
                            <>
                              {/* Dados do Cartão */}
                              <div className="mb-4">
                                <Label htmlFor="numeroCartao">
                                  Número do Cartão
                                </Label>
                                <Input
                                  type="text"
                                  className="mt-2 w-full"
                                  {...register("numeroCartao")}
                                />
                                {errors.numeroCartao && (
                                  <span className="text-red-500 text-sm">
                                    {errors.numeroCartao.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4">
                                <Label htmlFor="nomeTitular">
                                  Nome do Titular
                                </Label>
                                <Input
                                  type="text"
                                  className="mt-2 w-full"
                                  {...register("nomeTitular")}
                                />
                                {errors.nomeTitular && (
                                  <span className="text-red-500 text-sm">
                                    {errors.nomeTitular.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="w-full sm:w-1/2">
                                  <Label htmlFor="expiraMes">
                                    Mês de Expiração
                                  </Label>
                                  <Input
                                    type="text"
                                    className="mt-2 w-full"
                                    {...register("expiraMes")}
                                  />
                                  {errors.expiraMes && (
                                    <span className="text-red-500 text-sm">
                                      {errors.expiraMes.message}
                                    </span>
                                  )}
                                </div>

                                <div className="w-full sm:w-1/2">
                                  <Label htmlFor="expiraAno">
                                    Ano de Expiração
                                  </Label>
                                  <Input
                                    type="text"
                                    className="mt-2 w-full"
                                    {...register("expiraAno")}
                                  />
                                  {errors.expiraAno && (
                                    <span className="text-red-500 text-sm">
                                      {errors.expiraAno.message}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mb-4">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  type="text"
                                  className="mt-2 w-full"
                                  {...register("cvv")}
                                />
                                {errors.cvv && (
                                  <span className="text-red-500 text-sm">
                                    {errors.cvv.message}
                                  </span>
                                )}
                              </div>

                              <div className="mb-4 flex flex-col sm:flex-row justify-between mt-2">
                                <Button
                                  className="bg-gray-500 hover:bg-gray-900 text-app-text-color w-full sm:w-auto mb-2 sm:mb-0"
                                  onClick={() => setStep(step - 1)}
                                  type="button"
                                >
                                  Voltar
                                </Button>
                                <Button
                                  className="bg-app-bg-color hover:bg-gray-600 ml-auto text-app-text-color w-full sm:w-auto"
                                  onClick={() => setStep(step + 1)}
                                  type="button"
                                >
                                  Próximo
                                </Button>
                              </div>
                            </>
                          )}

                          {step === 4 && (
                            <>
                              {/* Parcelamento */}
                              <Input
                                type="hidden"
                                value={formatedTotal}
                                {...register("total")}
                              />
                              <div className="mb-4">
                                <Label htmlFor="parcelas">Parcelamento</Label>
                                <Select
                                  onValueChange={(value) =>
                                    setValue("parcelas", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Escolha o parcelamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[...Array(12).keys()].map((i) => (
                                      <SelectItem key={i} value={String(i + 1)}>
                                        {i + 1}x
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Botão de Submissão */}
                              <div className="mb-4 flex flex-col sm:flex-row justify-between mt-2">
                                <Button
                                  type="button"
                                  className="bg-gray-500 hover:bg-gray-900 text-app-text-color w-full sm:w-auto mb-2 sm:mb-0"
                                  onClick={() => setStep(step - 1)}
                                >
                                  Voltar
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-app-bg-color hover:bg-gray-600 ml-auto text-app-text-color w-full sm:w-auto"
                                >
                                  Finalizar Compra
                                </Button>
                              </div>
                            </>
                          )}
                        </form>
                      </div>
                      <div className="flex justify-end mt-5">
                        <div className="ml-auto">
                          <Button
                            className="bg-app-bg-color-2 hover:bg-app-bg-color-2 text-app-text-color-2 w-full sm:w-auto"
                            onClick={() => {
                              setIsCart(1);
                              //setIsPaid([]);
                            }}
                          >
                            Voltar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-auto bg-[#D9D9D9]">
                    <div className="flex flex-col w-auto h-auto p-8 bg-[#D9D9D9]">
                      <Badge className="text-center flex justify-center p-2 mb-4">
                        {msgApi}
                      </Badge>
                      <div className="flex flex-col justify-center items-center">
                        {erroApi?.map((erro, index) => (
                          <Badge
                            key={index}
                            className="text-white bg-red-800 hover:bg-red-600 p-2 mt-2"
                          >
                            Erro: {erro.message}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 ml-auto">
                        {lojaCarrinho.length < 1 ? (
                          <>
                            <Link
                              className="text-blue-600 underline"
                              to="/loja/"
                            >
                              Voltar para a página principal
                            </Link>
                          </>
                        ) : (
                          <>
                            <Button
                              className="bg-gray-600 hover:bg-gray-600"
                              onClick={() => setIsCart(2)}
                            >
                              Voltar ao formulário
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        </div>
        <FooterSite></FooterSite>
      </Main>
    </>
  );
}
