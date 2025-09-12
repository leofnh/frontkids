import { DollarSign, PiggyBank, User2 } from "lucide-react";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import { useData } from "../../components/context";
import { CardDash } from "./carddash";
import { CardVendas } from "./cardvendas";
import { toast, ToastContainer } from "react-toastify";
import { CardDashVendedor } from "./dashvendedor";

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
  const { dataProduct, formatedMoney, dataClient, dashboard } = useData();

  if (!dashboard) {
    return (
      <Main>
        <Nav></Nav>
        <div className="text-center items-center mt-4"></div>
      </Main>
    );
  }
  const countCliente = dataClient.length;

  const calcularValorTotal = (produtos) => {
    return produtos.reduce((valorTotal, produto) => {
      const valorNumerico = parseFloat(produto.preco.replace(/R\$|\s/g, ""));
      const valorTotalProduto = valorNumerico * produto.estoque;
      const result = valorTotal + valorTotalProduto;
      formatedMoney(result);
      return result;
    }, 0);
  };
  const valorTotal = calcularValorTotal(dataProduct);
  let vendaAnterior = dashboard.vendas_anterior;
  let vendaTotal = 0;
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
    let fracVenda = dashboard.total_venda - vendaAnterior;
    let divVenda = fracVenda / vendaAnterior;
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
    let fracVenda = vendaToday - vendaLastDay;
    let divVenda = fracVenda / vendaLastDay;
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 m-4 mt-5">
          <div className="rounded-xl border bg-white text-card-foreground shadow text-black">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight  font-medium">
                Balanço Patrimonial
              </h3>
              <PiggyBank size="15" />
            </div>
            <div className="p-6 pt-0 text-left">
              <div className="text-2xl text-green-500 font-bold">
                {formatedMoney(valorTotal)}
              </div>
              <p className="text-xs text-gray-400">Produtos em estoque</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white text-card-foreground shadow text-black">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight  font-medium">Clientes</h3>
              <User2 size="15" />
            </div>
            <div className="p-6 pt-0 text-left">
              <div className="text-2xl text-green-500 font-bold">
                {countCliente}
              </div>
              <p className="text-xs text-gray-400">{percCliente()}</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white text-card-foreground shadow text-black">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight  font-medium">Venda Mensal</h3>
              <DollarSign size="15" />
            </div>
            <div className="p-6 pt-0 text-left">
              <div className="text-2xl text-green-500 font-bold">
                {vendaTotal ? vendaTotal : "R$0,00"}
              </div>
              <p className="text-xs text-gray-400">
                {vendaAnterior
                  ? percentualVendasMes()
                  : "Não há vendas no mês anterior."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-white text-card-foreground shadow text-black">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight  font-medium">Venda hoje</h3>
              <DollarSign size="15" />
            </div>
            <div className="p-6 pt-0 text-left">
              <div className="text-2xl text-green-500 font-bold">
                {formatedMoney(vendaToday)}
              </div>
              <p className="text-xs text-gray-400">{percVendasOntem()}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2  md:grid-cols-2 lg:grid-cols-4 m-4  mt-5 text-left">
          <div className="grid grid-cols-2 space-x-2">
            <div>
              <CardVendas
                title="Pagamentos"
                description="Percentual por formas de pagamento."
                data={dashboard.payment}
              />
            </div>
            <div className="max-h-[750px] min-h-[550px]">
              <CardDash
                title="Notinhas"
                description="Notinhas vencendo"
                data={dashboard.notinha}
                notifyError={notifyErrorDash}
                notifySucces={notifySuccessDash}
              />
            </div>

            <ToastContainer />
          </div>
        </div>
        <div className="col-span-1 text-left mt-3 m-4">
          <div>
            <CardDashVendedor
              title="Vendedores"
              description="Lista de vendedores"
              data={dashboard.users}
              notifyError={notifyErrorDash}
              notifySuccess={notifySuccessDash}
            />
          </div>
        </div>
      </Main>
    </>
  );
}
