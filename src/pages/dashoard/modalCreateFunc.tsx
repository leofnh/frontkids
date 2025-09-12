import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { api } from "../../services/api";
import { useData } from "../../components/context";

const cadastroSendSchema = z.object({
  caduser: z.string().min(1, "* Campo obrigatório"),
  cadpassword: z.string().min(1, "* Campo obrigatório"),
  telefone: z.string().min(1, "* Campo obrigatório"),
  cargo: z.string(),
});
type cadastroSendSchema = z.infer<typeof cadastroSendSchema>;

interface iModalCreateUser {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
}

type userDataType = {
  cargo: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

export const ModalCreateFunc: React.FC<iModalCreateUser> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
}) => {
  const { setDashboard } = useData();
  const {
    register: registerCadastro,
    handleSubmit: handleCadastroSubmit,
    formState: { errors: cadastroErrors },
  } = useForm<cadastroSendSchema>({
    resolver: zodResolver(cadastroSendSchema),
  });

  const onSubmitCadastro = (data: cadastroSendSchema) => {
    createUser(data);
  };

  const createUser = async (data: cadastroSendSchema) => {
    try {
      const response = await api.post("api/create/user/", data);
      console.log(response);
      const status = response.data.status;
      if (status === "sucesso") {
        setDashboard(response.data.dados);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Obrigado por visitar nossa página!");
    }
  };

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
          <div className="space-y-[0.8px] text-sm">
            <form className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usuário
                </label>
                <Input
                  type="hidden"
                  value="admin"
                  {...registerCadastro("cargo")}
                />
                <Input
                  type="text"
                  placeholder="ex: Usuario"
                  className="w-full"
                  {...registerCadastro("caduser")}
                />
                {cadastroErrors.caduser && (
                  <p className="text-sm text-red-600">
                    {cadastroErrors.caduser.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telefone
                </label>
                <Input
                  type="telefone"
                  placeholder="3199999-9999"
                  className="w-full"
                  {...registerCadastro("telefone")}
                />
                {cadastroErrors.telefone && (
                  <p className="text-sm text-red-600">
                    {cadastroErrors.telefone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Input
                  id="password2"
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  {...registerCadastro("cadpassword")}
                />
                {cadastroErrors.cadpassword && (
                  <p className="text-sm text-red-600">
                    {cadastroErrors.cadpassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-row-reverse gap-1">
                <Button
                  className="h-7 bg-red-600 hover:bg-red-600"
                  type="button"
                  onClick={closeModal}
                >
                  Cancelar
                </Button>

                <Button
                  className="h-7 bg-green-600 hover:bg-green-600"
                  type="button"
                  onClick={handleCadastroSubmit(onSubmitCadastro)}
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
