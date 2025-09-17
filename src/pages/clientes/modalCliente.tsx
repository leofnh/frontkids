import React, { useEffect } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { DataCliente } from "../../components/types";

interface iModalCreateClient {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  handleSubmit: UseFormHandleSubmit<DataCliente>;
  handleFilterProduct: (data: DataCliente) => void;
  register: UseFormRegister<DataCliente>;
  errors: FieldErrors<DataCliente>;
  update: boolean;
  dataUpdate: DataCliente | undefined;
  setValue: UseFormSetValue<DataCliente>;
}

export const ModalCreateClient: React.FC<iModalCreateClient> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  handleSubmit,
  handleFilterProduct,
  register,
  errors,
  update,
  dataUpdate,
  setValue,
}) => {
  useEffect(() => {
    if (update && dataUpdate) {
      Object.keys(dataUpdate).forEach((key) => {
        const typedKey = key as keyof DataCliente;
        setValue(typedKey, dataUpdate[typedKey]);
      });
    }
  }, [update, dataUpdate, setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[95vw] sm:max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border border-brand-200 bg-white rounded-xl shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[95vh] overflow-hidden m-4">
        <div className="bg-gradient-to-r from-brand-50 to-brown-50 p-4 sm:p-6 border-b border-brand-200">
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-brown-800">
              {titleModal}
            </h2>
            <p className="text-xs sm:text-sm text-brown-600">
              {descriptionModal}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form
            onSubmit={handleSubmit(handleFilterProduct)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Nome - destaque em telas maiores */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-brown-700 font-medium">Nome *</Label>
                <Input
                  placeholder="Ex: Maria Silva..."
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  {...register("nome", { required: "Campo obrigatório" })}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs">{errors.nome?.message}</p>
                )}
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">CPF</Label>
                <Input
                  {...register("cpf")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: 112.601.720-20"
                />
                {errors.cpf && (
                  <p className="text-red-500 text-xs">{errors.cpf?.message}</p>
                )}
              </div>

              {/* Identidade */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Identidade</Label>
                <Input
                  {...register("idt")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: 802825"
                />
                {errors.idt && (
                  <p className="text-red-500 text-xs">{errors.idt?.message}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Nascimento</Label>
                <Input
                  type="date"
                  {...register("dn")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                />
                {errors.dn && (
                  <p className="text-red-500 text-xs">{errors.dn?.message}</p>
                )}
              </div>

              {/* Rua - mais espaço em tablets */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-brown-700 font-medium">
                  Endereço (Rua)
                </Label>
                <Input
                  {...register("rua")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: Rua Joaquim Gomes, 123..."
                />
                {errors.rua && (
                  <p className="text-red-500 text-xs">{errors.rua?.message}</p>
                )}
              </div>

              {/* Bairro */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Bairro</Label>
                <Input
                  {...register("bairro")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: Centro"
                />
                {errors.bairro && (
                  <p className="text-red-500 text-xs">
                    {errors.bairro?.message}
                  </p>
                )}
              </div>

              {/* Cidade */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Cidade</Label>
                <Input
                  {...register("cidade")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: São Paulo"
                />
                {errors.cidade && (
                  <p className="text-red-500 text-xs">
                    {errors.cidade?.message}
                  </p>
                )}
              </div>

              {/* Número */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Número</Label>
                <Input
                  {...register("numero")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: 32"
                />
                {errors.cidade && (
                  <p className="text-red-500 text-xs">
                    {errors.numero?.message}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Telefone</Label>
                <Input
                  {...register("telefone")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: (11) 99999-9999"
                />
                {errors.telefone && (
                  <p className="text-red-500 text-xs">
                    {errors.telefone?.message}
                  </p>
                )}
              </div>

              {/* Número do Sapato */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Nº Sapato</Label>
                <Input
                  {...register("sapato")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: 34"
                />
                {errors.sapato && (
                  <p className="text-red-500 text-xs">
                    {errors.sapato?.message}
                  </p>
                )}
              </div>

              {/* Tamanho da Roupa */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Nº Roupa</Label>
                <Input
                  {...register("roupa")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: G"
                />
                {errors.roupa && (
                  <p className="text-red-500 text-xs">
                    {errors.roupa?.message}
                  </p>
                )}
              </div>

              {/* Campo hidden para ID */}
              <div className="hidden">
                <Input
                  {...register("id", { valueAsNumber: true })}
                  type="number"
                  defaultValue={0}
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-brand-200 bg-white sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto min-w-[120px]"
                onClick={closeModal}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all w-full sm:w-auto min-w-[150px]"
              >
                {!update ? "Cadastrar Cliente" : "Atualizar Dados"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
