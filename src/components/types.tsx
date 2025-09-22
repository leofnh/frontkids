export type ImgSlide = {
  url: string;
  cadastro: string;
  update: string;
  id: number;
};

export type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

export interface ProductGroup {
  ref: string;
  produto: string;
  marca: string;
  preco: number;
  id: number;
  estoque: number;
  codigo: string;
  //custo: number;
  update: string;
  sequencia: number;
  descricao: string;
  tamanho: string;
  coresETamanhos: Array<{
    //cor: string;
    tamanho: string | number;
    estoque: number;
    id_product_loja: number;
  }>;
}

export type TypeCurrent = {
  cliente: string;
  id: number;
  produto: string;
  status: string;
  valor: number;
  vencimento: string;
};

type Notinha = {
  id?: number;
  cliente: string;
  produto: string;
  status: string;
  valor: number;
  vencimento: string;
};

type Payment = {
  forma: string;
  percentual: number;
};

type UserDashboard = {
  id: number;
  username: string;
  venda_atual: number;
  venda_anterior: number;
};

export type TypeDashboard = {
  total_venda: number;
  notinha: Notinha[];
  payment: Payment[];
  vendas_anterior: number | null;
  perc_cliente: number;
  users: UserDashboard[];
  vendas_hoje: number;
  vendas_ontem: number | null;
};

export type ProductType = {
  id: number;
  cadastro: string;
  update: string;
  cor: string;
  codigo: string;
  custo: number;
  descricao: string;
  estoque: number;
  loja: boolean;
  marca: string;
  preco: number;
  produto: string;
  ref: string;
  sequencia: number;
  tamanho: string;
};

export type ProductFormData = {
  ref: string;
  loja: boolean;
  marca: string;
  codigo: string;
  tamanho: string;
  preco: string;
  custo: string;
  estoque: number;
  produto: string;
  cor: string;
  descricao: string;
  //sequencia: number;
  id?: number;
  cadastro?: string;
  update?: string;
};

export type DataCliente = {
  nome: string;
  cpf: string;
  idt: string;
  dn: string;
  rua: string;
  bairro: string;
  cidade: string;
  numero: string;
  sapato: string;
  roupa: string;
  telefone: string;
  id: number;
};

export type ImgProductType = {
  id: number;
  id_produto: string;
  url: string;
  codigo: string;
};

export type CondicionalType = {
  id: number;
  cliente: string;
  aberto: boolean;
  cadastro: string;
  update: string;
  nome: string;
  contato: string;
};

export type ProdutoCondicional = {
  id: number;
  produto: string;
  ref: string;
  codigo: string;
  condicional: number;
  nome: string;
  cliente: string;
  data_retirada: string;
  data_devolvido: string;
  vendido: boolean;
  cadastro: string;
  update: string;
  preco: number;
  cpf: string;
};

export type TypeCarrinho = {
  id: number;
  produto: string;
  marca: string;
  tamanho: string;
  ref: string;
  qtde: number;
  preco: number;
  codigo: string;
};

export type TypeProduct = {
  id: number;
  codigo: string;
  preco: number;
  produto: string;
  qtde: number;
  ref: string;
  tamanho: string;
  marca: string;
};
