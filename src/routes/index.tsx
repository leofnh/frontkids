import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "../pages/login";
import { Home } from "../pages/home";
import { ObjectsPage } from "../pages/objects";
import { Caixa } from "../pages/caixa";
import { Produtos } from "../pages/produtos/produtos";
import { Clientes } from "../pages/clientes";
import { useData } from "../components/context";
import { Dashboard } from "../pages/dashoard";
import { LojaProdutos } from "../pages/loja";
import { CarrinhoPage } from "../pages/loja/carrinho";
import { DashSite } from "../pages/sitedash/index";
import { MeusPedidos } from "../pages/loja/meuspedidos";
import { SiteConfig } from "../pages/siteconfig";
//import { SobreNos } from "../pages/siteconfig/sobrenos";
//import { SobreNosSite } from "../pages/loja/sobrenos";
import { DetalhesProduto } from "../pages/loja/detalhes";

type userDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

export default function CustomRoutes() {
  const { isAuthenticated, userData } = useData() as {
    isAuthenticated: boolean;
    userData: userDataType[];
  };

  function hasAccess(userRole: string) {
    return userRole === "admin" || userRole === "func";
  }

  return (
    <Routes>
      <Route path="/" element={<LojaProdutos />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/loja/" element={<LojaProdutos />} />
      <Route path="/loja/carrinho/" element={<CarrinhoPage />} />
      <Route path="/loja/meus/pedidos/" element={<MeusPedidos />} />
      {/* <Route path="loja/sobrenos/" element={<SobreNosSite />} /> */}
      <Route path="/detalhes/" element={<DetalhesProduto />} />

      {isAuthenticated ? (
        hasAccess(userData[0]?.cargo) ? (
          <>
            <Route path="/home/" element={<Home />} />
            <Route path="/objetos/:id_pca" element={<ObjectsPage />} />
            <Route path="/caixa/" element={<Caixa />} />
            <Route path="/produtos/" element={<Produtos />} />
            <Route path="/clientes/" element={<Clientes />} />
            <Route path="/dashboard/" element={<Dashboard />} />
            <Route path="/vendas/site/" element={<DashSite />} />
            <Route path="/config/site/" element={<SiteConfig />} />
            {/* <Route path="/config/sobrenos/" element={<SobreNos />} /> */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/loja/" />} />
        )
      ) : (
        <Route path="*" element={<Navigate to="/login/" />} />
      )}
    </Routes>
  );
}
