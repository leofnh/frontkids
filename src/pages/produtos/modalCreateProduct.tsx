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
      //   overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-white p-6 shadow-lg sm:rounded-lg overflow-y-auto max-h-[90vh] dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-4">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {titleModal}
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(handleFilterProduct)}
              className="grid grid-cols-1"
            >
              <div className="grid grid-cols-2 mt-4 gap-8">
                <div>
                  <Label>Nome do Produto</Label>
                  <Input
                    placeholder="Ex: Blusa..."
                    className="mt-1"
                    {...register("produto")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ativar na loja</Label>
                  <div className="flex items-center gap-2">
                    <p>
                      <Switch
                        checked={loja}
                        onCheckedChange={handleSwitchChange}
                      />
                    </p>
                    <div>
                      <Input
                        placeholder="Sequência, Ex: 1"
                        {...register("sequencia")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mt-2 gap-8">
                <div>
                  <Label>Marca</Label>
                  <Input
                    placeholder="Ex: Arezzo..."
                    className="mt-1"
                    {...register("marca")}
                  />
                </div>

                <div>
                  <Label>Tamanho</Label>
                  <Input
                    {...register("tamanho")}
                    className="mt-1"
                    placeholder="Ex: G"
                  />
                </div>

                <div>
                  <Label>Referência</Label>
                  <Input
                    {...register("ref")}
                    className="mt-1"
                    placeholder="Ex: A119030024"
                  />
                </div>
                <div>
                  <Label>Preço de Venda</Label>
                  <Input
                    onInput={handleChangePrice}
                    value={watch("preco")}
                    {...register("preco")}
                    className="mt-1"
                    placeholder="Ex: 79,90"
                  />
                </div>

                <div>
                  <Label>Custo</Label>
                  <Input
                    {...register("custo")}
                    value={watch("custo")}
                    className="mt-1"
                    placeholder="Ex: 39,90"
                    onInput={handleCustoChange}
                  />
                </div>

                <div>
                  <Label>Estoque</Label>
                  <Input
                    type="number"
                    {...register("estoque")}
                    className="mt-1"
                    placeholder="Ex: 1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 mt-2 gap-8">
                <div>
                  <Label>Cor</Label>
                  <Input {...register("cor")} className="mt-1" type="color" />
                </div>
                <div>
                  <Label>Código de barras</Label>
                  <Input
                    {...register("codigo")}
                    className="mt-1"
                    placeholder="Ex: 7900029868144"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevenir o envio automático
                      }
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <Textarea {...register("descricao")}></Textarea>
                </div>
              </div>

              <div className="flex mt-5 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button
                  type="button"
                  className="bg-red-600 rounded-lg hover:bg-red-600 h-7"
                  onClick={closeModal}
                >
                  Fechar
                </Button>

                <Button
                  type="submit"
                  className="bg-green-600 rounded-lg hover:bg-green-600 h-7"
                >
                  {!update ? "Cadastrar Produto" : "Atualizar Produto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
