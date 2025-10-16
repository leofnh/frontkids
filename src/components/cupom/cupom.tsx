import { Button } from "../ui/button";

/**
 * Componente para geração de cupom fiscal/não fiscal
 * Suporta vendas em tempo real (dataUpdate) e vendas já realizadas (dadosVendaPreservados)
 */

interface CupomImpProps {
  handleToast: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  today: string;
  forma: string;
  vendedorName: string;
  nameClient: string;
  nameClientCupom: string;
  contatoClient: string;
  dataUpdate: Array<{
    produto: string;
    ref: string;
    qtde: number;
    preco: string;
  }>;
  dadosVendaPreservados: Array<{
    produto: string;
    ref: string;
    qtde: number;
    preco: string;
  }>;
  total: number;
  subtotal: number;
  troco: number;
  calcularParcela: () => Array<{
    numero: number;
    data: string;
    valor: string;
  }>;
  formatedMoney: (value: number) => string;
}

export const CupomImp = (props: CupomImpProps) => {
  const {
    handleToast,
    contentRef,
    today,
    forma,
    vendedorName,
    nameClient,
    nameClientCupom,
    contatoClient,
    dataUpdate,
    dadosVendaPreservados,
    total,
    subtotal,
    troco,
    calcularParcela,
    formatedMoney,
  } = props;

  // Validação básica das props essenciais
  if (!formatedMoney || !today) {
    return null;
  }
  return (
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
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                alt="Paula Kids"
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

          <p className="font-bold bg-gray-300 text-[10px]">Dados do Cliente</p>
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

          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold border-b border-dashed pb-1">
            <span className="text-left">Produto</span>
            <span className="text-center">Ref.</span>
            <span className="text-center">Qtde</span>
            <span className="text-right">Valor</span>
          </div>

          {/* Linhas da tabela */}
          <div className="space-y-1">
            {(dataUpdate.length > 0 ? dataUpdate : dadosVendaPreservados).map(
              (item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-1 text-[10px] py-0.5"
                >
                  <span className="text-left truncate" title={item.produto}>
                    {item.produto}
                  </span>
                  <span className="text-center truncate" title={item.ref}>
                    {item.ref}
                  </span>
                  <span className="text-center">{item.qtde}</span>
                  <span className="text-right whitespace-nowrap">
                    R${item.preco}
                  </span>
                </div>
              )
            )}
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
                    <span className="truncate max-w-[40%]">{parcela.data}</span>
                    <span>R$ {parcela.valor}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <hr className="my-2 border-dashed border-t-2" />
          <p className="font-bold mt-2 bg-gray-100 text-[10px]">Detalhamento</p>
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
  );
};
