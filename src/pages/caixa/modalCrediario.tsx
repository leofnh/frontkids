import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

type FormData = {
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
};

interface iModalCrediario {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  handleSubmit: UseFormHandleSubmit<FormData>;
  handleFilterProduct: (data: FormData) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const ModalCreateCrediario: React.FC<iModalCrediario> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  handleSubmit,
  handleFilterProduct,
  register,
  errors,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border border-brand-200 bg-white rounded-xl shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-brand-50 to-brown-50 p-6 border-b border-brand-200">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-brown-800">
              {titleModal}
            </h2>
            <p className="text-sm text-brown-600">{descriptionModal}</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleFilterProduct)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Nome</Label>
                <Input
                  placeholder="Ex: Maria..."
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

              {/* Rua */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Rua</Label>
                <Input
                  {...register("rua")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: Joaquim Gomes..."
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

              {/* Número */}
              <div className="space-y-2">
                <Label className="text-brown-700 font-medium">Número</Label>
                <Input
                  {...register("numero")}
                  className="border-brand-200 focus:border-brand-400 focus:ring-brand-200"
                  placeholder="Ex: 123"
                />
                {errors.numero && (
                  <p className="text-red-500 text-xs">
                    {errors.numero?.message}
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
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-brand-200">
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={closeModal}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all"
              >
                Cadastrar Cliente
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
