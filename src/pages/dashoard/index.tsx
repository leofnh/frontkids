import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import { useData } from "../../components/context";
import { CardDash } from "./carddash";
import { CardVendas } from "./cardvendas";
import { toast, ToastContainer } from "react-toastify";
import { CardDashVendedor } from "./dashvendedor";
import { TypeCurrent } from "../../components/types";

interface Produto {
  preco: string;
  estoque: number;
}

interface PaymentData {
  forma: string;
  percentual: number;
}

interface Vendedor {
  id: number;
  username: string;
  venda_anterior: number;
  venda_atual: number;
}

interface Dashboard {
  vendas_anterior: number;
  vendas_ontem: number;
  vendas_hoje: number;
  total_venda: number;
  perc_cliente: number;
  payment: PaymentData[];
  notinha: TypeCurrent[];
  users: Vendedor[];
}

interface DataContextType {
  dataProduct: Produto[];
  formatedMoney: (value: number) => string;
  dataClient: unknown[];
  dashboard: Dashboard;
}

export function Dashboard() {
  const notifySuccessDash = (text: string) =>
    toast.success(text, {
      theme: "light",
      autoClose: 1000,
    });
  const notifyErrorDash = (text: string) =>
    toast.error(text, {
      theme: "light",
      autoClose: 1000,
    });
  const { dataProduct, formatedMoney, dataClient, dashboard } =
    useData() as DataContextType;

  if (!dashboard) {
    return (
      <Main>
        <Nav></Nav>
        <div className="text-center items-center mt-4"></div>
      </Main>
    );
  }
  const countCliente = dataClient.length;

  const calcularValorTotal = (produtos: Produto[]) => {
    return produtos.reduce((valorTotal: number, produto: Produto) => {
      const valorNumerico = parseFloat(produto.preco.replace(/R\$|\s/g, ""));
      const valorTotalProduto = valorNumerico * produto.estoque;
      const result = valorTotal + valorTotalProduto;
      formatedMoney(result);
      return result;
    }, 0);
  };
  const valorTotal = calcularValorTotal(dataProduct);
  const vendaAnterior = dashboard.vendas_anterior;
  let vendaTotal: string | number = 0;
  let vendaToday = 0;
  let vendaLastDay = 0;
  if (dashboard.vendas_ontem) {
    vendaLastDay = dashboard.vendas_ontem;
  }
  if (dashboard.vendas_hoje) {
    vendaToday = dashboard.vendas_hoje;
  }
  if (dashboard.total_venda) {
    vendaTotal = formatedMoney(dashboard.total_venda);
  }

  const percentualVendasMes = () => {
    if (vendaAnterior === null || vendaAnterior === 0) {
      if (dashboard.total_venda > 0) {
        return "+∞% em relação a ontem";
      } else {
        return "0% em relação a ontem";
      }
    }
    const fracVenda = dashboard.total_venda - vendaAnterior;
    const divVenda = fracVenda / vendaAnterior;
    let result = divVenda * 100;
    if (!result) {
      result = 0;
    }
    const formatedResult = parseFloat(result.toFixed(1));
    const resultText = "+" + formatedResult + "% em relação ao último mês";
    return resultText;
  };

  const percVendasOntem = () => {
    if (vendaLastDay === null || vendaLastDay === 0) {
      if (vendaToday > 0) {
        return "+∞% em relação a ontem";
      } else {
        return "0% em relação a ontem";
      }
    }
    const fracVenda = vendaToday - vendaLastDay;
    const divVenda = fracVenda / vendaLastDay;
    let result = divVenda * 100;
    if (!result) {
      result = 0;
    }
    const formatedResult = parseFloat(result.toFixed(1));
    const resultText = "+" + formatedResult + "% em relação ao último mês";
    return resultText;
  };

  const percCliente = () => {
    const perc_cliente = dashboard.perc_cliente;
    const formatedClient = parseFloat(perc_cliente.toFixed(1));
    const stringText = "+" + formatedClient + "% em relação ao último mês";
    return stringText;
  };

  return (
    <>
      <Main>
        <Nav></Nav>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-6">
          {/* Balanço Patrimonial Card */}
          <div className="group relative rounded-xl border border-brand-200 bg-gradient-to-br from-white via-brand-50/30 to-brand-100/50 shadow-sm hover:shadow-lg hover:shadow-brand-200/25 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl shadow-lg group-hover:shadow-brand-500/25 transition-all duration-300 group-hover:scale-110">
                      <Wallet size="20" className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-800 group-hover:text-brown-900 transition-colors">
                      Patrimônio
                    </h3>
                    <p className="text-xs text-brown-500">Estoque Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-100/80 px-2 py-1 rounded-full">
                  <TrendingUp size="12" />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-brand-600 group-hover:text-brand-700 transition-colors">
                  {formatedMoney(valorTotal)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-600">
                    Produtos em estoque
                  </span>
                  <div className="flex items-center gap-1 text-brand-600">
                    <ArrowUpRight
                      size="16"
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clientes Card */}
          <div className="group relative rounded-xl border border-brown-200 bg-gradient-to-br from-white via-brown-50/30 to-brown-100/50 shadow-sm hover:shadow-lg hover:shadow-brown-200/25 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-brown-500 to-brown-600 rounded-xl shadow-lg group-hover:shadow-brown-500/25 transition-all duration-300 group-hover:scale-110">
                      <Users size="20" className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-800 group-hover:text-brown-900 transition-colors">
                      Clientes
                    </h3>
                    <p className="text-xs text-brown-500">Base Ativa</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-blue-600 bg-blue-100/80 px-2 py-1 rounded-full">
                  <Target size="12" />
                  <span className="text-xs font-medium">Total</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-brown-700 group-hover:text-brown-800 transition-colors">
                  {countCliente.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-600">
                    {percCliente()}
                  </span>
                  <div className="flex items-center gap-1 text-brown-600">
                    <ArrowUpRight
                      size="16"
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Venda Mensal Card */}
          <div className="group relative rounded-xl border border-green-200 bg-gradient-to-br from-white via-green-50/30 to-green-100/50 shadow-sm hover:shadow-lg hover:shadow-green-200/25 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300 group-hover:scale-110">
                      <Calendar size="20" className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white">
                      <div className="w-full h-full bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-800 group-hover:text-brown-900 transition-colors">
                      Mensal
                    </h3>
                    <p className="text-xs text-brown-500">Vendas do Mês</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-100/80 px-2 py-1 rounded-full">
                  {dashboard.total_venda > (vendaAnterior || 0) ? (
                    <TrendingUp size="12" />
                  ) : (
                    <TrendingDown size="12" />
                  )}
                  <span className="text-xs font-medium">
                    {dashboard.total_venda > (vendaAnterior || 0)
                      ? "Alta"
                      : "Baixa"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                  {vendaTotal ? vendaTotal : "R$0,00"}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-600">
                    {vendaAnterior
                      ? percentualVendasMes()
                      : "Sem dados anteriores"}
                  </span>
                  <div className="flex items-center gap-1 text-green-600">
                    {dashboard.total_venda > (vendaAnterior || 0) ? (
                      <ArrowUpRight
                        size="16"
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    ) : (
                      <ArrowDownRight
                        size="16"
                        className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Venda Hoje Card */}
          <div className="group relative rounded-xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/50 shadow-sm hover:shadow-lg hover:shadow-emerald-200/25 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                      <DollarSign size="20" className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 flex">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-75"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-800 group-hover:text-brown-900 transition-colors">
                      Hoje
                    </h3>
                    <p className="text-xs text-brown-500">Vendas Diárias</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100/80 px-2 py-1 rounded-full">
                  {vendaToday > (vendaLastDay || 0) ? (
                    <TrendingUp size="12" />
                  ) : (
                    <TrendingDown size="12" />
                  )}
                  <span className="text-xs font-medium">
                    {vendaToday > (vendaLastDay || 0) ? "Subindo" : "Caindo"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {formatedMoney(vendaToday)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-600">
                    {percVendasOntem()}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-600">
                    {vendaToday > (vendaLastDay || 0) ? (
                      <ArrowUpRight
                        size="16"
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    ) : (
                      <ArrowDownRight
                        size="16"
                        className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="w-full">
              <CardVendas
                title="Pagamentos"
                description="Percentual por formas de pagamento."
                data={dashboard.payment}
              />
            </div>
            <div className="w-full">
              <CardDash
                title="Notinhas"
                description="Notinhas vencendo"
                data={dashboard.notinha}
                notifyError={notifyErrorDash}
                notifySuccess={notifySuccessDash}
              />
            </div>
          </div>
        </div>

        {/* Vendedores Section */}
        <div className="px-6 pb-6">
          <div className="w-full mt-6">
            <CardDashVendedor
              title="Vendedores"
              description="Lista de vendedores"
              data={dashboard.users}
              notifyError={notifyErrorDash}
              notifySuccess={notifySuccessDash}
            />
          </div>
        </div>

        <ToastContainer />
      </Main>
    </>
  );
}
