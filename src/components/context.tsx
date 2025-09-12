import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ImgSlide, ProductType } from "./types";

type userDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

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

export const DataContext = createContext({});

export function DataProvider({ children }) {
  const userDataStart: userDataType[] = [
    {
      cargo: "visitante",
      first_name: "",
      id: 0,
      last_name: "",
      username: "visitante",
    },
  ];

  const [dataProduct, setProduct] = useState<ProductType[]>([]);
  const [dataProductLoja, setProductLoja] = useState([]);
  const [dataClient, setClient] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(userDataStart);
  const navigate = useNavigate();
  const [lojaCarrinho, setLojaCarrinho] = useState("");
  const [imgProduct, setImgProduct] = useState([]);
  const [myPedido, setMyPedido] = useState<MyPedidoType[]>([]);
  const [isImgSlide, setImgSlide] = useState<ImgSlide[]>([]);

  const ConfigSite: ConfigSiteType = {
    body: "#ffffff",
    header: "#787878",
    footer: "#f3f4f6",
  };

  const [isConfigSite, setConfigSite] = useState<ConfigSiteType>(ConfigSite);

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

  const login = async (data: Array<string>) => {
    setLoading(true);
    try {
      const response = await api.post("api/login/", data);
      const status = response.data.status;
      if (status === "sucesso") {
        setUserData(response.data.dados_user);
        setIsAuthenticated(true);
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.dados_user)
        );
        await fetchData();
        const pathName = location.pathname;
        if (pathName === "/login" || pathName === "/login/") {
          navigate("/caixa");
        }
      } else {
        notifyError(response.data.msg);
      }
    } catch (error) {
      notifyError("Erro ao realizar login.");
      setError(error);
      setIsAuthenticated(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserData(userDataStart);
    setIsAuthenticated(false);
    localStorage.removeItem("userData");
    navigate("/login");
  };
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const pageAtual = location.pathname;
    if (storedUserData && storedUserData !== "undefined") {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setIsAuthenticated(true);
      fetchData().then(() => {
        if (pageAtual === "/login" || pageAtual === "/login/") {
          navigate("/caixa");
        }
      });
    } else {
      fetchData();
    }
  }, [navigate]);

  // Função para buscar dados de API
  const fetchData = async () => {
    setLoading(true);
    const storedUserData = localStorage.getItem("userData");
    const parsedData = JSON.parse(storedUserData);
    let cargo = "usuario";
    //let usuario_name = "visitante";
    let id_usuario = 0;
    if (storedUserData) {
      cargo = parsedData[0].cargo;
      //usuario_name = parsedData[0].username;
      id_usuario = parsedData[0].id;
    }

    try {
      if (cargo === "admin" || cargo === "func") {
        //toast("Carregando dados...", { type: "info" });
        const [
          productsResponse,
          clientsResponse,
          dashResponse,
          productLoja,
          productCarrinho,
          apiImgProduct,
          apiImgSlide,
        ] = await Promise.all([
          api.get("api/produtos/"),
          api.get("api/clientes/"),
          api.get("api/dashboard/"),
          api.get("api/produtos/loja/"),
          api.get(`api/add/carrinho/1/`),
          api.get("api/add/image/products/"),
          api.get("api/get/imgslide/"),
        ]);

        const productsData = productsResponse.data.dados;
        const formatedProducts = productsData.map((product) => ({
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
        const productDataLoja = productLoja.data.dados;
        const dataCarrinho = productCarrinho.data.dados;
        const apiImg = apiImgProduct.data.dados;
        const apiSlide = apiImgSlide.data.dados;
        setImgSlide(apiSlide);
        setProductLoja(productDataLoja);
        setDashboard(dashResponse.data);
        setProduct(formatedProducts);
        setClient(clientsResponse.data.dados);
        setLojaCarrinho(dataCarrinho);
        setImgProduct(apiImg);

        //toast("Dados carregados com sucesso!", { type: "success" });
      } else {
        const [
          productLoja,
          productCarrinho,
          apiImgProduct,
          myPedidos,
          apiImgSlide,
        ] = await Promise.all([
          api.get("api/produtos/loja/"),
          api.get(`api/add/carrinho/${id_usuario}/`),
          api.get("api/add/image/products/"),
          api.get(`api/meus/pedidos/${id_usuario}/`),
          api.get("api/get/imgslide/"),
        ]);
        const productDataLoja = productLoja.data.dados;
        const dataCarrinho = productCarrinho.data.dados;
        const apiImg = apiImgProduct.data.dados;
        const pedidoData = myPedidos.data.dados;
        const apiSlide = apiImgSlide.data.dados;
        setImgSlide(apiSlide);
        setProductLoja(productDataLoja);
        setLojaCarrinho(dataCarrinho);
        setImgProduct(apiImg);
        setMyPedido(pedidoData);
      }
    } catch (error) {
      console.error(error);
      setError(error);
      toast("Erro ao carregar os dados. Verifique o console.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatedMoney = (value: number) => {
    if (value === null) {
      value = 0;
    }
    const formatValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    return formatValue;
  };
  const formatedDate = (value: string) => {
    const date = new Date(value);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat("pt-BR", options).format(date);
  };
  return (
    <DataContext.Provider
      value={{
        dataProduct,
        setProduct,
        dataClient,
        setClient,
        dashboard,
        formatedMoney,
        setDashboard,
        login,
        logout,
        isImgSlide,
        setImgSlide,
        isConfigSite,
        setConfigSite,
        isAuthenticated,
        userData,
        loading,
        dataProductLoja,
        lojaCarrinho,
        setLojaCarrinho,
        imgProduct,
        setImgProduct,
        formatedDate,
        myPedido,
        notifyError,
        notifySuccess,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useData() {
  return useContext(DataContext);
}
