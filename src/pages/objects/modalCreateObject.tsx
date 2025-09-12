import React from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface iModalCreateObject {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  handleSubmit: (data: { ano: string; usuario: string }) => void;
  handleFilterProduct: (data: { ano: string; usuario: string }) => void;
  register: (data: { ano: string; usuario: string }) => void;
}

export const ModalCreateObject: React.FC<iModalCreateObject> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  handleSubmit,
  handleFilterProduct,
  register,
}) => {
  const modalidades = [
    { id: "pe", nome: "Pregão Eletrônico" },
    { id: "de", nome: "Dispensa Eletrônica" },
    { id: "cd", nome: "Credenciamento" },
  ];
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
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
                  <Label>Objeto</Label>
                  <Input
                    placeholder="Ex: Merenda Escolar..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Modalidade</Label>
                  <div className="mt-1 w-full">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Modalidades</SelectLabel>
                          {modalidades.map((mod) => (
                            <SelectItem value={mod.id}>{mod.nome}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Data Estimada</Label>
                  <Input className="mt-1 w-auto" type="date" />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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
                  Criar PCA
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
