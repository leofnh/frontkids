import React, { useRef } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Wallet,
  UserCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useData } from "../../components/context";
import { ModalConfirmVenda } from "./modalConfirm";
import { useReactToPrint } from "react-to-print";
import { TypeProduct } from "../../components/types";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

// Tipos locais para o dashboard e usuários
interface UserDashboard {
  id: number;
  username: string;
}

interface TypeDashboard {
  total_venda: number;
  vendas_hoje: number;
  users: UserDashboard[];
}

interface ItemVenda {
  codigo: string;
  code_status: string;
  qtde: number;
}

interface PayloadVenda {
  forma: string;
  data: TypeProduct[];
  vendedor: string;
  total: number;
  parcelas?: string | null;
  data_vencimento?: string | null;
  cliente?: string;
  valor_parcela?: number | string | null;
  [key: string]: string | number | TypeProduct[] | null | undefined;
}

interface iCard {
  title: string;
  description: string;
  subtotal: number;
  troco: number;
  setTroco: React.Dispatch<React.SetStateAction<number>>;
  forma: string;
  setForma: (forma: string) => void;
  dataUpdate: TypeProduct[];
  notifyError: (text: string) => void;
  notifySuccess: (text: string) => void;
  setDataUpdate: React.Dispatch<React.SetStateAction<TypeProduct[]>>;
  setSubtotal: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

export const CardCaixaFinish: React.FC<iCard> = ({
  title,
  description,
  subtotal,
  troco,
  setTroco,
  forma,
  setForma,
  dataUpdate,
  notifyError,
  notifySuccess,
  setDataUpdate,
  setSubtotal,
  setTotal,
  total,
}) => {
  const { handleSubmit } = useForm();
  const [selectedOption, setSelectedOption] = useState("");
  const [contatoClient, setContatoClient] = useState("");
  const [loading, setLoading] = useState(false);
  const { setProduct, setDashboard, dashboard, dataClient, formatedMoney } =
    useData() as {
      setProduct: React.Dispatch<React.SetStateAction<TypeProduct[]>>;
      setDashboard: React.Dispatch<React.SetStateAction<TypeDashboard>>;
      dashboard: TypeDashboard;
      dataClient: Array<{
        id: number;
        nome: string;
        rua: string;
        bairro: string;
        numero: string;
        cidade: string;
      }>;
      formatedMoney: (value: number) => string;
    };
  const [iTroco, setItroco] = useState("");
  const [searchClient, setSearchClient] = useState<null | boolean>(null);
  const [nameClient, setClientName] = useState("");
  const [countryClient, setClientCountry] = useState("");
  const [isVendedor, setIsVendedor] = useState("");
  const [parcelas, setParcelas] = useState<string | null>(null);
  const [dataVencimento, setVencimento] = useState<string | null>(null);
  const [valorParcela, setValorParcela] = useState<number | string | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vendedorName, setVendedorName] = useState<string>("");
  const [nameClientCupom, setNameClientCupom] = useState("");

  const handleVendedorName = (e: string) => {
    const username = dashboard.users.find(
      (v: UserDashboard) => v.id === Number(e)
    );
    if (username) {
      setVendedorName(username.username);
    }
  };
  const today = new Date().toLocaleDateString();

  const contentRef = useRef<HTMLDivElement>(null);
  const handleContat = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value.replace(/\D/g, "");
    if (input.length > 11) {
      input = input.slice(0, 11); // Limita a 11 dígitos
    }
    const formattedPhone = input
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");

    setContatoClient(formattedPhone);
  };

  const handleNameClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameClientCupom(e.target.value);
  };
  const reactToPrintFn = useReactToPrint({ contentRef });
  const calcularParcela = () => {
    const parcelasComVencimento = [];
    if (parcelas && dataVencimento) {
      for (let i = 0; i < Number(parcelas); i++) {
        const newDataVencimento = new Date(dataVencimento);
        newDataVencimento.setMonth(newDataVencimento.getMonth() + i);
        //newDataVencimento.setDate(newDataVencimento.getDate() + 1);

        const dataFormated = newDataVencimento.toLocaleDateString("pt-BR");
        parcelasComVencimento.push({
          numero: i + 1,
          data: dataFormated,
          valor: valorParcela,
        });
      }
    }

    return parcelasComVencimento;
  };

  const isOpenConfirm = () => {
    setIsConfirmOpen(!isConfirmOpen);
  };
  const sendVenda = async (data: PayloadVenda) => {
    setLoading(true);
    try {
      const response = await toast.promise(api.post("api/venda/", data), {
        pending: {
          render: "Registrando venda...",
          autoClose: 100,
        },
        success: {
          render: "Dados enviado com sucesso!",
          autoClose: 100,
        },
        error: {
          render: "Erro ao enviar os dados...",
          autoClose: 1000,
        },
      });
      const dataResp = response.data;
      const status = dataResp["status"];
      const alert = dataResp["msg"];
      const tem_erro = dataResp["tem_erro"];
      //setValorParcela(0);
      if (status == "erro") {
        if (tem_erro) {
          notifyError(dataResp["erro_msg"]);
        } else {
          notifyError(alert);
        }
      } else {
        const tem_nota = dataResp["notinhas"];
        const vendas_de_hoje = dataResp["venda_hoje"];
        setDashboard((prevDash: TypeDashboard) => ({
          ...prevDash,
          vendas_hoje: vendas_de_hoje,
        }));
        if (tem_nota) {
          setDashboard((prevDash: TypeDashboard) => ({
            ...prevDash,
            notinha: tem_nota,
          }));
        }
        notifySuccess(alert);
        //setTotal(0);
        //setSubtotal(0);
        //setTroco(0);
      }
      const lista_codigo = dataResp["lista_codigo"];
      // codar aqui
      lista_codigo.forEach((item: ItemVenda) => {
        setDataUpdate(
          (prevData) =>
            prevData
              .map((rmItem) => {
                if (rmItem.codigo === item.codigo) {
                  return null; // Marca para remoção
                }
                return rmItem;
              })
              .filter((rmItem) => rmItem !== null) // Filtra os itens removidos
        );
        setProduct((prevData) =>
          prevData
            .map((rmItem) => {
              if (rmItem.codigo === item.codigo) {
                if (item.code_status == "sucesso") {
                  const totalVenda = dashboard.total_venda;
                  const precoItem = String(rmItem.preco)
                    .replace("R", "")
                    .replace("$", "")
                    .replace(",", ".");
                  const price = Number(precoItem) * item.qtde;
                  const newTotal = price + totalVenda;
                  setDashboard((prevDash) => ({
                    ...prevDash,
                    total_venda: newTotal,
                  }));
                  const produtoExtendido = rmItem as TypeProduct & {
                    estoque: number;
                  };
                  if (produtoExtendido.estoque - item.qtde <= 0) {
                    return null;
                  }

                  return {
                    ...rmItem,
                    estoque: produtoExtendido.estoque - item.qtde,
                  } as TypeProduct & { estoque: number };
                }
              }

              return rmItem;
            })
            .filter((rmItem) => rmItem !== null)
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateVencimento = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVencimento(event.target.value);
  };
  const handleParcelas = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParcelas(event.target.value);
    const valorParcela = subtotal / parseInt(event.target.value);
    setValorParcela(formatedMoney(valorParcela));
  };

  const handleToast = () => {
    toast(
      ({ closeToast }) => (
        <div className="p-4 text-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            Deseja imprimir a segunda via?
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all duration-150"
              onClick={() => {
                reactToPrintFn();
                closeToast();
                setSelectedOption("");
                setForma("");
                setTotal(0);
                setSubtotal(0);
                setTroco(0);
                setValorParcela(0);
              }}
            >
              Imprimir
            </Button>
            <Button
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 transition-all duration-150"
              onClick={() => {
                closeToast();
                setSelectedOption("");
                setForma("");
                setTotal(0);
                setSubtotal(0);
                setTroco(0);
                setValorParcela(0);
              }}
            >
              Não
            </Button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        className: "rounded-lg shadow-lg bg-white",
        onClose: () => {
          setSelectedOption("");
          setForma("");
          setTotal(0);
          setSubtotal(0);
          setTroco(0);
        },
      }
    );
  };

  const onSubmit = () => {
    setIsConfirmOpen(true);
  };

  const onSubmit2 = (formData: Record<string, string | number>) => {
    setIsConfirmOpen(false);
    if (isVendedor == "") {
      return notifyError("Selecione um vendedor!");
    }
    if (forma == "") {
      return notifyError("Escolha uma forma de pagamento!");
    } else if (dataUpdate == null) {
      return notifyError("O carrinho esta vazio!");
    } else {
      const payload: PayloadVenda = {
        ...formData,
        forma: selectedOption,
        data: dataUpdate,
        vendedor: isVendedor,
        total: total,
      };
      if (forma == "crediario") {
        payload.parcelas = parcelas;
        payload.data_vencimento = dataVencimento;
        payload.cliente = nameClient;
        payload.valor_parcela = valorParcela;
        if (parcelas && nameClient && dataVencimento) {
          sendVenda(payload);
        } else {
          return notifyError(
            "Preencha os campos corretamente, verifique o número de parcelas, nome do cliente e data de vencimento"
          );
        }
      } else {
        sendVenda(payload);
      }
    }
    //setSelectedOption("");
    //setForma("");
    reactToPrintFn();
    handleToast();
    // setIsVendedor("");
  };

  const formatToCurrency = (value: number | string | null) => {
    if (!value) return "";
    const valueFloat = parseFloat(value as string) / 100;
    const formatoMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const newFormat = formatoMoeda.format(valueFloat);
    return newFormat.replace("$", "").replace("R", "");
  };

  const handleChangeItroco = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove qualquer coisa que não seja dígito
    value = formatToCurrency(value);
    setItroco(value);
  };

  const handleTroco = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, "");
    value = formatToCurrency(value);
    const numericValue = value.replace(/\./g, "").replace(",", ".");
    const floatValue = parseFloat(numericValue);
    if (forma == "dinheiro" || forma == "debito" || forma == "pix") {
      subtotal = total;
    }
    const newTroco = floatValue - subtotal;
    // const resultado = newTroco.toFixed(2);
    if (value) {
      setTroco(newTroco);
      //formatToCurrency(resultado.replace(".", ""))
    } else {
      setTroco(0);
    }
  };
  const handleOptionChange = (newForma: string) => {
    setSelectedOption(newForma);
    setForma(newForma);
    setTroco(0);
    setSearchClient(null);
    handleTotal(newForma);
  };
  const handleTotal = (selected: string) => {
    if (selected == "dinheiro" || selected == "debito" || selected == "pix") {
      const desconto = subtotal * 0.1;
      const totalPrice = subtotal - desconto;
      //const formatedTotal = totalPrice.toFixed(2);
      //setTotal(formatedTotal);
      setTotal(totalPrice);
    } else {
      setTotal(0);
    }
  };

  const handleSearchClient = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cpf = event.target.value;
    const searchClient = dataClient.some(
      (client: { nome: string }) => client.nome == cpf
    );
    if (cpf) {
      if (searchClient) {
        const client = dataClient.find(
          (client: { nome: string }) => client.nome === cpf
        );
        if (client) {
          setClientCountry(
            client.rua +
              ", " +
              client.bairro +
              ", " +
              client.numero +
              ", " +
              client.cidade
          );
          setClientName(client.nome);
        }
        setSearchClient(false);
      } else {
        setSearchClient(true);
      }
    } else {
      setSearchClient(null);
    }
  };

  return (
    <>
      <Card className="bg-white border-brand-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
          <CardTitle className="text-xl font-semibold text-brown-800">
            {title}
          </CardTitle>
          <CardDescription className="text-brown-600">
            {description}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-brown-700 font-medium text-sm">
                Forma de Pagamento
              </Label>
              <RadioGroup
                value={selectedOption}
                onValueChange={handleOptionChange}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 p-2 border border-brand-200 rounded-md hover:bg-brand-50 transition-colors">
                  <RadioGroupItem value="dinheiro" id="dinheiro" />
                  <Banknote className="text-green-600" size={16} />
                  <Label
                    htmlFor="dinheiro"
                    className="text-brown-700 font-medium text-sm"
                  >
                    Dinheiro
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-brand-200 rounded-md hover:bg-brand-50 transition-colors">
                  <RadioGroupItem value="pix" id="pix" />
                  <Smartphone className="text-blue-600" size={16} />
                  <Label
                    htmlFor="pix"
                    className="text-brown-700 font-medium text-sm"
                  >
                    Pix
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-brand-200 rounded-md hover:bg-brand-50 transition-colors">
                  <RadioGroupItem value="debito" id="debito" />
                  <CreditCard className="text-purple-600" size={16} />
                  <Label
                    htmlFor="debito"
                    className="text-brown-700 font-medium text-sm"
                  >
                    Débito
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-brand-200 rounded-md hover:bg-brand-50 transition-colors">
                  <RadioGroupItem value="credito" id="credito" />
                  <Wallet className="text-brand-600" size={16} />
                  <Label
                    htmlFor="credito"
                    className="text-brown-700 font-medium text-sm"
                  >
                    Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border border-brand-200 rounded-md hover:bg-brand-50 transition-colors col-span-2">
                  <RadioGroupItem value="crediario" id="crediario" />
                  <UserCheck className="text-brown-600" size={16} />
                  <Label
                    htmlFor="crediario"
                    className="text-brown-700 font-medium text-sm"
                  >
                    Crediário
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              {forma !== "crediario" && forma !== "" && (
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium text-sm">
                    Dados do Cliente (opcional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Nome do cliente"
                      className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 h-9 text-sm"
                      onChange={handleNameClient}
                      value={nameClientCupom}
                    />
                    <Input
                      placeholder="Telefone do cliente"
                      className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 h-9 text-sm"
                      onChange={handleContat}
                      value={contatoClient}
                    />
                  </div>
                </div>
              )}
              {forma === "dinheiro" && (
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium text-sm">
                    Valor Recebido
                  </Label>
                  <Input
                    placeholder="Valor recebido..."
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 h-9"
                    onChange={handleTroco}
                    onInput={handleChangeItroco}
                    value={iTroco}
                  />
                </div>
              )}

              {forma === "crediario" && (
                <div className="border-t border-brand-200 pt-3 space-y-3">
                  <h3 className="text-base font-medium text-brown-800">
                    Dados do Crediário
                  </h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-brown-700 font-medium text-sm">
                        Cliente:
                      </Label>
                      <Input
                        className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 h-9 text-sm"
                        placeholder="Digite o CPF do cliente"
                        onChange={handleSearchClient}
                      />
                    </div>
                    {searchClient === true && (
                      <span className="text-red-500 font-medium text-sm bg-red-50 p-2 rounded-md border border-red-200">
                        Cliente não encontrado.
                      </span>
                    )}
                  </div>
                  {searchClient === false && (
                    <div className="space-y-4">
                      <div className="bg-app-bg-color p-4 rounded-lg shadow-inner text-app-text-color text-left text-sm">
                        <p>
                          <span className="font-bold">Nome:</span> {nameClient}
                        </p>
                        <p>
                          <span className="font-bold">Endereço:</span>{" "}
                          {countryClient}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                          <Label>Nº de Parcelas</Label>
                          <Input
                            placeholder="Parcelas"
                            type="number"
                            onChange={handleParcelas}
                          />
                        </div>
                        <div>
                          <Label>Primeira Parcela</Label>
                          <Input type="date" onChange={handleDateVencimento} />
                        </div>

                        {parcelas && (
                          <div className="col-span-2">
                            Valor da parcela: {valorParcela}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {dataUpdate.length > 0 && (
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium text-sm">
                  Vendedor Responsável
                </Label>
                <select
                  className="w-full h-9 bg-white border border-brand-200 rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 
                  text-brown-800 text-sm pl-3 pr-8"
                  onChange={(e) => {
                    setIsVendedor(e.target.value);
                    handleVendedorName(e.target.value);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione o vendedor
                  </option>
                  {dashboard &&
                    dashboard.users.map((vendedor: UserDashboard) => (
                      <option key={vendedor.id} value={vendedor.id}>
                        {vendedor.username}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-brand-50 to-brown-50 border-t border-brand-200 flex flex-col items-end gap-4">
            <div className="w-full space-y-3 text-right">
              <div className="flex justify-between text-brown-700">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">{formatedMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-brown-800 border-t border-brand-200 pt-2">
                <span>Total:</span>
                <span className="text-brand-600">
                  {total ? formatedMoney(total) : formatedMoney(subtotal)}
                </span>
              </div>
              {forma === "dinheiro" && (
                <div
                  className={`flex justify-between font-medium ${
                    troco < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  <span>Troco:</span>
                  <span>{formatedMoney(troco)}</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
              disabled={loading || dataUpdate.length === 0}
            >
              {loading ? "Processando..." : "Finalizar Venda"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <ModalConfirmVenda
        isOpen={isConfirmOpen}
        titleModal="Finalizando venda"
        descriptionModal=""
        closeModal={isOpenConfirm}
        finish={handleSubmit(onSubmit2)}
      />

      <div className="hidden">
        <Button onClick={handleToast}>Imprimir!</Button>
        <div
          ref={contentRef}
          className="w-[58mm] p-2 text-black bg-white text-[10px]"
          style={{
            fontFamily: "monospace",
            margin: "auto",
            width: "70mm",
          }}
        >
          <div className="text-center space-y-1">
            <h2 className="font-bold bg-gray-100 text-[10px]">Paula Kids</h2>
            <div className="space-x-2 flex">
              <div className="w-[64px]">
                <img
                  src="https://i.imgur.com/1gjHoAF.png"
                  className="w-full h-auto"
                />
              </div>
              <div className="text-[10px]">
                <p>Rua Getulio Vargas 48 - Centro</p>
                <p>35995-000 S.Domingos Prata - MG</p>
                <p>30.393.198/0001-81</p>
                <p>(31)99734-6732</p>
              </div>
            </div>

            <div className="my-2 text-[10px]">
              <p className="font-bold bg-gray-300 text-[10px]">
                DOCUMENTO AUXILIAR DE VENDA
              </p>
              <p className="font-bold bg-gray-300 text-[10px]">
                NÃO POSSUI VALIDADE FISCAL
              </p>
              <p className="flex jsutify-between mt-2">
                <span>Emissão:</span>
                <span className="ml-auto">{today}</span>
              </p>
              <p className="flex">
                <span className="flex">Pagamento: </span>
                <span className="ml-auto">{forma}</span>
              </p>
              <p className="flex">
                <span className="flex">Vendedor(a): </span>
                <span className="ml-auto">{vendedorName}</span>
              </p>

              {forma === "crediario" && (
                <p className="flex jsutify-between">
                  <span>Cliente</span>
                  <span className="ml-auto">{nameClient}</span>
                </p>
              )}
            </div>

            <hr className="my-2 border-dashed border-t-2" />

            <p className="font-bold bg-gray-300 text-[10px]">
              Dados do Cliente
            </p>
            <div className="flex text-[10px]">
              <span>Consumidor:</span>
              <span className="ml-auto">
                {forma === "crediario" ? (
                  <>{nameClient}</>
                ) : (
                  <>{nameClientCupom}</>
                )}
              </span>
            </div>

            <div className="flex text-[10px]">
              <span>Contato</span>
              <span className="ml-auto">{contatoClient}</span>
            </div>

            <hr className="my-2 border-dashed border-t-2" />

            <p className="font-bold bg-gray-300 text-[10px]">
              Relação dos Produtos
            </p>
            <p className="flex justify-between text-[10px]">
              <span>Produto</span>
              <span>Ref.</span>
              <span>valor</span>
            </p>
            <div>
              {dataUpdate.map((item, index) => (
                <p key={index} className="flex justify-between text-xs">
                  <span className="truncate max-w-[33%]">{item.produto}</span>
                  <span className="ml-auto">{item.ref}</span>
                  <span className="ml-auto">R$ {item.preco}</span>
                </p>
              ))}
            </div>

            <div className="flex justify-between font-bold text-[10px]">
              <span>Total a Pagar</span>
              <span>
                {forma === "dinheiro" || forma === "pix" || forma === "debito"
                  ? formatedMoney(total)
                  : formatedMoney(subtotal)}
              </span>
            </div>

            {forma === "crediario" && (
              <>
                <p className="font-bold mt-2">Parcelamento</p>
                <div>
                  {calcularParcela().map((parcela) => (
                    <div className="flex justify-between" key={parcela.numero}>
                      <span className="truncate max-w-[40%]">
                        {parcela.numero}ª
                      </span>
                      <span className="truncate max-w-[40%]">
                        {parcela.data}
                      </span>
                      <span>R$ {parcela.valor}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <hr className="my-2 border-dashed border-t-2" />
            <p className="font-bold mt-2 bg-gray-100 text-[10px]">
              Detalhamento
            </p>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Forma</span>
                <span>{forma}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Valor Bruto</span>
                <span>{formatedMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Desconto</span>
                <span>
                  {forma === "dinheiro" || forma === "pix" || forma === "debito"
                    ? "10,00%"
                    : "0,00%"}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="truncate max-w-[60%]">Valor com desconto</span>
                <span>
                  {forma === "dinheiro" || forma === "pix" || forma == "debito"
                    ? formatedMoney(total)
                    : formatedMoney(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Troco</span>
                <span>R$ {formatedMoney(troco) || "0,00"}</span>
              </div>
            </div>

            {forma === "crediario" && (
              <div className="mt-4 text-center">
                <p className="mt-5">Assinatura: X_________________________</p>
                <p>{nameClient}</p>
              </div>
            )}

            <hr className="my-2 border-dashed border-t-2" />
          </div>
        </div>
      </div>
    </>
  );
};
