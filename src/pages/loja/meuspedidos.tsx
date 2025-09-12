import { useState } from "react";
import { useData } from "../../components/context";
import { Main } from "../../components/main";
import { FooterSite, NavSite } from "../../components/navsite";
import { Badge } from "../../components/ui/badge";
import { SheetPedido } from "./sheetpedidos";
type MyPedidoType = {
  id: number;
  id_produto: number;
  nome_usuario: string;
  quantidade: number;
  pedido: boolean;
  enviado: boolean;
  contato: string;
  endereco: string;
  cliente: string;
  email: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  cadastro: string;
  update: string;
  produto: string;
  marca: string;
  preco: number;
  codigo: string;
  estoque: number;
};
export function MeusPedidos() {
  const { myPedido } = useData() as { myPedido: MyPedidoType[] };
  const [isSheetListOpen, setSheetList] = useState(true);
  return (
    <>
      <Main className="text-app-text-color bg-[#D9D9D9]">
        <NavSite></NavSite>

        <div className="gap-4 w-full space-y-4 mt-4 mb-8">
          <h3 className="font-bold text-black">Meus pedidos</h3>
          {myPedido?.map((pedido) => (
            <>
              <div className="bg-[#d4C2AE] flex flex-row text-black p-8">
                <div className="flex flex-row gap-8 ml-10">
                  <div>
                    <img
                      src="https://i.imgur.com/ybvN8FD.jpeg"
                      className="rounded-full w-[120px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <span>{pedido.produto}</span>
                  </div>
                </div>
                <div className="flex flex-row ml-auto gap-64">
                  <div className="flex flex-col space-y-6 items-start">
                    <div>
                      <span className="underline font-bold solid text-[#7B6648]">
                        Status
                      </span>
                    </div>
                    <div className="flex text-center justify-center items-center">
                      <Badge
                        className={
                          pedido.enviado ? "bg-green-600 " : "bg-yellow-600 "
                        }
                      >
                        {pedido.enviado ? "Enviado" : "Aguardando"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {SheetPedido(pedido)}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>

        <FooterSite></FooterSite>
      </Main>
    </>
  );
}
