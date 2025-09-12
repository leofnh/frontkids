import React, { useEffect, useState } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

interface iModalCreateClient {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  handleSubmit: (data: {
    nome: string;
    cpf: string;
    idt: string;
    dn: string;
    rua: string;
    bairro: string;
    numero: string;
    cidade: string;
    sapato: string;
    roupa: string;
    telefone: string;
    id: string;
  }) => void;
  handleFilterProduct: (data: {
    nome: string;
    cpf: string;
    idt: string;
    dn: string;
    rua: string;
    bairro: string;
    numero: string;
    cidade: string;
    sapato: string;
    roupa: string;
    telefone: string;
    id: string;
  }) => void;
  register: (data: {
    nome: string;
    cpf: string;
    idt: string;
    dn: string;
    rua: string;
    bairro: string;
    numero: string;
    cidade: string;
    sapato: string;
    roupa: string;
    telefone: string;
    id: string;
  }) => void;
  errors: string;
  update: boolean;
  dataUpdate: Array<string>;
  setValue: () => void;
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
    if (update) {
      // Define o valor dos campos do formulário com os dados de dataUpdate
      Object.keys(dataUpdate).forEach((key) => {
        setValue(key, dataUpdate[key]);
      });
    }
  }, [update, dataUpdate, setValue]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-1">
          <div className="text-lg font-semibold leading-none tracking-tight">
            <span>{titleModal}</span>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(handleFilterProduct)}
              className="grid grid-cols-1"
            >
              <div className="grid grid-cols-3 mt-4 gap-8">
                <div>
                  <Label>Nome</Label>
                  <Input
                    placeholder="Ex: Maria..."
                    className="mt-1"
                    {...register("nome", { required: "Campo obrigatório" })}
                  />
                  {errors.nome && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.nome?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>CPF</Label>
                  <Input
                    {...register("cpf")}
                    className="mt-1"
                    placeholder="Ex: 112.601.720-20"
                  />
                  {errors.cpf && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.cpf?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Identidade</Label>
                  <Input
                    {...register("idt")}
                    className="mt-1"
                    placeholder="Ex: 802825"
                  />
                  {errors.idt && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.idt?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Nascimento</Label>
                  <Input
                    type="date"
                    {...register("dn")}
                    className="mt-1"
                    placeholder="Ex: 13/11/1992"
                  />
                  {errors.dn && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.dn?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Rua</Label>
                  <Input
                    {...register("rua")}
                    className="mt-1"
                    placeholder="Ex: Joaquim Gomes..."
                  />
                  {errors.rua && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.rua?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Bairro</Label>
                  <Input
                    {...register("bairro")}
                    className="mt-1"
                    placeholder="Ex: Centro"
                  />
                  {errors.bairro && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.bairro?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Cidade</Label>
                  <Input
                    {...register("cidade")}
                    className="mt-1"
                    placeholder="Ex: São Domingos do Prata"
                  />
                  {errors.cidade && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.cidade?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Telefone</Label>
                  <Input
                    {...register("telefone")}
                    className="mt-1"
                    placeholder="Ex: (31)99999-9999"
                  />
                  {errors.telefone && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.telefone?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Número</Label>
                  <Input
                    type="number"
                    {...register("numero")}
                    className="mt-1"
                    placeholder="Ex: 120"
                  />
                  {errors.numero && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.numero?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Nº Sapato</Label>
                  <Input
                    {...register("sapato")}
                    className="mt-1"
                    placeholder="Ex: 34"
                  />
                  {errors.sapato && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.sapato?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Nº Roupa</Label>
                  <Input
                    {...register("roupa")}
                    className="mt-1"
                    placeholder="Ex: G"
                  />
                  {errors.roupa && (
                    <p className="text-red-600 text-[9px]">
                      *{errors.roupa?.message}
                    </p>
                  )}
                </div>

                <div className="sr-only">
                  <Input {...register("id")} />
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
                  {!update ? "Cadastrar cliente" : "Atualizar Dados"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
