import { FileCog } from "lucide-react";
import { useData } from "../../components/context";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import { Button } from "../../components/ui/button";
import { CardDashSite } from "./carddash";
import { Link } from "react-router-dom";
type ProductCarrinho = {
  produto: string;
  nome_usuario: string;
  id_produto: number;
  quantidade: number;
  marca: string;
  codigo: string;
  cliente: string;
  preco: number;
  endereco: string;
  cadastro: string;
  contato: string;
  enviado: boolean;
  cidade: string;
  estado: string;
};
export function DashSite() {
  const { lojaCarrinho } = useData() as { lojaCarrinho: ProductCarrinho[] };
  return (
    <>
      <Main>
        <Nav></Nav>
        <div className="flex m-4">
          <div className="ml-auto">
            <Link to="/config/site/">
              <Button className="flex gap-1 bg-blue-800 hover:bg-blue-900">
                <FileCog size={14} />
                Configurar o site
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <div className="col-span-1 text-left mt-3 m-4">
            <div>
              <CardDashSite
                title="Vendas realizadas no site"
                description="Lista de vendas"
                data={lojaCarrinho}
                //notifyError={notifyErrorDash}
                //notifySuccess={notifySuccessDash}
              />
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}
