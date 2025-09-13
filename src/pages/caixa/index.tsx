import { useState } from "react";
import { Nav } from "../../components/nav";
import { CardSearchCode } from "./cardCode";
import { CardTable } from "./cardTable";
import { toast, ToastContainer } from "react-toastify";
import { CardCaixaFinish } from "./cardCaixa";
import { useData } from "../../components/context";
import { ProductGroup, TypeCarrinho } from "../../components/types";

export function Caixa() {
  //const [dataBody, setDataBody] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [forma, setForma] = useState("");
  const [troco, setTroco] = useState(0);
  const { dataProduct } = useData() as {
    dataProduct: ProductGroup[];
    // setProduct: (data: ProductGroup[]) => void;
  };
  const [total, setTotal] = useState<number>(0);
  const [dataUpdate, setDataUpdate] = useState<TypeCarrinho[]>([]);

  const notifySuccess = (text: string) =>
    toast.success(text, {
      theme: "light",
      autoClose: 500,
      position: "top-left",
    });
  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "light",
      autoClose: 500,
      position: "top-left",
    });
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brown-50">
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <ToastContainer
            position="top-right"
            autoClose={500}
            toastClassName="!bg-white !text-brown-800 border border-brand-200 shadow-lg"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brown-800 mb-2">
              Ponto de Venda (PDV)
            </h1>
            <p className="text-brown-600">
              Gerencie vendas e processe pagamentos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CardSearchCode
                title="Produtos"
                description="Digite o código de barras para encontrar o produto."
                dataProduct={dataProduct}
                handleData={setDataUpdate}
                dataUpdate={dataUpdate}
                notifyError={notifyError}
                setSubtotal={setSubtotal}
                forma={forma}
                troco={troco}
                setTroco={setTroco}
                subTotal={subtotal}
                setTotal={setTotal}
              />
            </div>
            <div className="lg:col-span-2">
              <CardTable
                title="CAIXA"
                description=""
                dataBody={dataUpdate}
                setData={setDataUpdate}
                setSubtotal={setSubtotal}
                subTotal={subtotal}
                forma={forma}
                setTotal={setTotal}
                total={total}
              />
            </div>
            <div className="lg:col-span-1">
              <CardCaixaFinish
                title="Finalizando"
                description="Confirme com os cliente os dados da venda antes de finalizar."
                subtotal={subtotal}
                troco={troco}
                setTroco={setTroco}
                forma={forma}
                setForma={setForma}
                dataUpdate={dataUpdate}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                setDataUpdate={setDataUpdate}
                setSubtotal={setSubtotal}
                total={total}
                setTotal={setTotal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
