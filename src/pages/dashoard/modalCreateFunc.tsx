import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { api } from "../../services/api";
import { useData } from "../../components/context";
import {
  UserPlus,
  User,
  Phone,
  Lock,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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

interface DataContextType {
  setDashboard: (data: unknown) => void;
}

export const ModalCreateFunc: React.FC<iModalCreateUser> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
}) => {
  const { setDashboard } = useData() as DataContextType;
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
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      {/* Modal Container com Scroll */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md max-h-[90vh] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl border border-brand-200 shadow-2xl shadow-brand-900/10 overflow-hidden flex flex-col max-h-full">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-brand-50 to-brown-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-brand-200 rounded-t-2xl flex-shrink-0">
              <button
                onClick={closeModal}
                className="absolute right-3 sm:right-4 top-3 sm:top-4 p-2 rounded-full bg-white/80 hover:bg-white border border-brand-200 text-brown-600 hover:text-brown-800 transition-all duration-200 hover:scale-105"
              >
                <X size="18" />
              </button>

              <div className="flex items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl shadow-lg">
                  <UserPlus size="20" className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brown-800">
                    {titleModal}
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    {descriptionModal}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form
                className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                onSubmit={handleCadastroSubmit(onSubmitCadastro)}
              >
                {/* Hidden cargo field */}
                <Input
                  type="hidden"
                  value="admin"
                  {...registerCadastro("cargo")}
                />

                {/* Usuário Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="caduser"
                    className="flex items-center gap-2 text-sm font-semibold text-brown-700"
                  >
                    <User size="16" className="text-brand-600" />
                    Nome de Usuário
                  </label>
                  <div className="relative">
                    <Input
                      id="caduser"
                      type="text"
                      placeholder="Digite o nome do usuário..."
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-brand-200 text-brown-800 placeholder-brown-400 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-200/50 transition-all duration-200"
                      {...registerCadastro("caduser")}
                    />
                    <User
                      size="18"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                    />
                  </div>
                  {cadastroErrors.caduser && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle size="16" />
                      {cadastroErrors.caduser.message}
                    </div>
                  )}
                </div>

                {/* Telefone Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="telefone"
                    className="flex items-center gap-2 text-sm font-semibold text-brown-700"
                  >
                    <Phone size="16" className="text-brand-600" />
                    Telefone
                  </label>
                  <div className="relative">
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(31) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-brand-200 text-brown-800 placeholder-brown-400 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-200/50 transition-all duration-200"
                      {...registerCadastro("telefone")}
                    />
                    <Phone
                      size="18"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                    />
                  </div>
                  {cadastroErrors.telefone && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle size="16" />
                      {cadastroErrors.telefone.message}
                    </div>
                  )}
                </div>

                {/* Senha Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="cadpassword"
                    className="flex items-center gap-2 text-sm font-semibold text-brown-700"
                  >
                    <Lock size="16" className="text-brand-600" />
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="cadpassword"
                      type="password"
                      placeholder="Digite uma senha segura..."
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-brand-200 text-brown-800 placeholder-brown-400 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-200/50 transition-all duration-200"
                      {...registerCadastro("cadpassword")}
                    />
                    <Lock
                      size="18"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400"
                    />
                  </div>
                  {cadastroErrors.cadpassword && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle size="16" />
                      {cadastroErrors.cadpassword.message}
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size="18"
                      className="text-brand-600 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-brand-800">
                        Informações importantes:
                      </p>
                      <ul className="text-xs text-brand-700 mt-2 space-y-1">
                        <li>
                          • O usuário será criado com cargo de administrador
                        </li>
                        <li>• Certifique-se de usar um telefone válido</li>
                        <li>• A senha deve ser segura e confidencial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="bg-gray-50 border-t border-brand-200 px-4 sm:px-6 py-3 sm:py-4 rounded-b-2xl flex-shrink-0">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <X size="16" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  onClick={handleCadastroSubmit(onSubmitCadastro)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-medium shadow-lg hover:shadow-brand-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <UserPlus size="16" />
                  Criar Vendedor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
