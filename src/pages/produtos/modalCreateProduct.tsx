import React, { useEffect } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ProductFormData } from "../../components/types";

interface iModalCreateProduct {
  isOpen: boolean;
  update: boolean;
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  dataUpdate: ProductFormData;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  handleSubmit: UseFormHandleSubmit<ProductFormData>;
  handleFilterProduct: (data: {
    marca: string;
    codigo: string;
    tamanho: string;
    ref: string;
    preco: string;
    custo: string;
    estoque: string;
    produto: string;
    loja: boolean;
    cor: string;
    sequencia: string;
    descricao: string;
  }) => void;
  register: UseFormRegister<ProductFormData>;
}

export const ModalCreateProduct: React.FC<iModalCreateProduct> = ({
  isOpen,
  update,
  closeModal,
  titleModal,
  descriptionModal,
  handleSubmit,
  handleFilterProduct,
  register,
  dataUpdate,
  setValue,
  watch,
}) => {
  useEffect(() => {
    if (update) {
      // Define o valor dos campos do formulário com os dados de dataUpdate
      // Object.keys(dataUpdate).forEach((key) => {
      //   setValue(key, dataUpdate[key]);
      // });
      (Object.keys(dataUpdate) as (keyof ProductFormData)[]).forEach((key) => {
        setValue(key, dataUpdate[key]);
      });
    } else {
      // Limpa os valores do formulário para um novo cadastro
      setValue("marca", "");
      setValue("codigo", "");
      setValue("tamanho", "");
      setValue("ref", "");
      setValue("preco", "");
      setValue("custo", "");
      setValue("estoque", "");
      setValue("produto", "");
      setValue("cor", "");
      setValue("descricao", "");
      setValue("loja", false);
    }
  }, [update, dataUpdate, setValue]);
  //const [iCusto, setCusto] = useState("");
  // const [iPreco, setPreco] = useState("");
  const loja = watch("loja");

  const handleSwitchChange = () => {
    setValue("loja", !loja);
  };

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/[^\d,]/g, "");
    value = formatToCurrency(value);
    //setPreco(value);
    setValue("preco", value);
  };
  const handleCustoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    // Remove qualquer caractere que não seja número ou vírgula/ponto
    value = value.replace(/[^\d,]/g, "");
    // Formatar o valor com separadores de milhares e decimais
    value = formatToCurrency(value);
    //setCusto(value);
    setValue("custo", value);
  };

  const formatToCurrency = (value: string) => {
    if (!value) return "";
    value = value.replace(/\./g, "").replace(/,/g, "");
    if (value.length > 2) {
      value =
        value.slice(0, value.length - 2) + "," + value.slice(value.length - 2);
    }
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return value;
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-0 border border-brand-200 bg-white rounded-xl shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-50 to-brown-50 p-6 border-b border-brand-200">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-brown-800">
              {titleModal}
            </h2>
            <p className="text-sm text-brown-600">{descriptionModal}</p>
          </div>
        </div>

        {/* Content with scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form
            onSubmit={handleSubmit(handleFilterProduct)}
            className="space-y-8"
          >
            {/* Seção 1: Informações principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-brown-700 border-b border-brand-200 pb-2">
                Informações Principais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nome do Produto - destaque com mais espaço */}
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-brown-700 font-medium">
                    Nome do Produto *
                  </Label>
                  <Input
                    placeholder="Ex: Blusa Feminina..."
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    {...register("produto")}
                  />
                </div>

                {/* Configurações da loja */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">
                    Configurações da Loja
                  </Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={loja}
                        onCheckedChange={handleSwitchChange}
                      />
                      <span className="text-sm text-brown-600">
                        Ativar na loja online
                      </span>
                    </div>
                    {loja && (
                      <Input
                        placeholder="Sequência (Ex: 1)"
                        className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                        {...register("sequencia")}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Detalhes do produto */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-brown-700 border-b border-brand-200 pb-2">
                Detalhes do Produto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Marca */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">Marca</Label>
                  <Input
                    placeholder="Ex: Arezzo, Nike..."
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    {...register("marca")}
                  />
                </div>

                {/* Tamanho */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">Tamanho</Label>
                  <Input
                    {...register("tamanho")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: G, 40, M"
                  />
                </div>

                {/* Referência */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">
                    Referência
                  </Label>
                  <Input
                    {...register("ref")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: A119030024"
                  />
                </div>

                {/* Cor */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">
                    Cor do Produto
                  </Label>
                  <Input
                    {...register("cor")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 h-12"
                    type="color"
                  />
                </div>

                {/* Código de barras */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-brown-700 font-medium">
                    Código de Barras
                  </Label>
                  <Input
                    {...register("codigo")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: 7900029868144"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevenir o envio automático
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Valores e estoque */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-brown-700 border-b border-brand-200 pb-2">
                Valores e Estoque
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preço de venda */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">
                    Preço de Venda *
                  </Label>
                  <Input
                    onInput={handleChangePrice}
                    value={watch("preco")}
                    {...register("preco")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: 79,90"
                  />
                </div>

                {/* Custo */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">Custo *</Label>
                  <Input
                    {...register("custo")}
                    value={watch("custo")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: 39,90"
                    onInput={handleCustoChange}
                  />
                </div>

                {/* Estoque */}
                <div className="space-y-2">
                  <Label className="text-brown-700 font-medium">
                    Quantidade em Estoque
                  </Label>
                  <Input
                    type="number"
                    {...register("estoque")}
                    className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                    placeholder="Ex: 10"
                    min="0"
                  />
                </div>
              </div>
            </div>
            {/* Seção 4: Descrição */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-brown-700 border-b border-brand-200 pb-2">
                Descrição do Produto
              </h3>

              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">
                  Descrição Detalhada
                </Label>
                <Textarea
                  {...register("descricao")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200 min-h-[100px] resize-none"
                  placeholder="Descreva detalhadamente o produto, suas características, materiais, etc..."
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-brand-200 bg-white sticky bottom-0">
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 min-w-[120px]"
                onClick={closeModal}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all min-w-[150px]"
              >
                {!update ? "Cadastrar Produto" : "Atualizar Produto"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
