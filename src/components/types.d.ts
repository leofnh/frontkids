import { Dispatch, SetStateAction } from "react";

export type UserDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

export type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

export type MyPedidoType = {
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

export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  update: string;
  user: string;
  limite: number;
}

export type TypeProduct = {
  id: number;
  codigo: string;
  produto: string;
  descricao: string;
  marca: string;
  preco: number;
  estoque: number;
  loja: string;
  cor: string;
  sequencia: number;
  foto: string;
};

export type TypeVenda = {
  id: number;
  cliente: string;
  vendedor: string;
  preco: number;
  data: string;
  forma: string;
};

export type TypeCurrent = {
  id: number;
  cliente: string;
  produto: string;
  vencimento: string;
  valor: number;
  status: string;
};

export type TypeUser = {
  id: number;
  username: string;
  vendas: number;
  total: number;
};

export type TypePayment = {
  forma: string;
  total: number;
};

export interface DashboardData {
  total_venda: number;
  vendas_hoje: number;
  vendas_ontem: number;
  vendas_anterior: number;
  perc_cliente: number;
  notinha: TypeCurrent[];
  users: TypeUser[];
  payment: TypePayment[];
}

export type ImgSlide = {
  id: number;
  img: string;
};

export type ProductType = {
  id: number;
  codigo: string;
  produto: string;
  descricao: string;
  marca: string;
  preco: number;
  estoque: number;
  loja: string;
  cor: string;
  sequencia: number;
  foto: string;
};

export interface DataContextType {
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  userData: UserDataType | null;
  setUserData: Dispatch<SetStateAction<UserDataType | null>>;
  configSite: ConfigSiteType | null;
  setConfigSite: Dispatch<SetStateAction<ConfigSiteType | null>>;
  myPedido: MyPedidoType[];
  setMyPedido: Dispatch<SetStateAction<MyPedidoType[]>>;
  dataClient: Client[];
  setDataClient: Dispatch<SetStateAction<Client[]>>;
  dataProduct: TypeProduct[];
  setDataProduct: Dispatch<SetStateAction<TypeProduct[]>>;
  dataVenda: TypeVenda[];
  setDataVenda: Dispatch<SetStateAction<TypeVenda[]>>;
  dashboard: DashboardData | null;
  setDashboard: Dispatch<SetStateAction<DashboardData | null>>;
  imgSlide: ImgSlide[];
  setImgSlide: Dispatch<SetStateAction<ImgSlide[]>>;
  formatedMoney: (value: number) => string;
  handleLogin: (data: Record<string, any>) => Promise<void>;
  handleLogout: () => void;
  notify: (text: string) => void;
  notifyError: (text: string) => void;
  notifySuccess: (text: string) => void;
  notifyInfo: (text: string) => void;
  notifyWarn: (text: string) => void;
}