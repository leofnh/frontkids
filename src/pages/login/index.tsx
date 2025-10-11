import {
  PersonStanding,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Main } from "../../components/main";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useData } from "../../components/context";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

import { api } from "../../services/api";

const infoSendSchema = z.object({
  user: z.string().min(1, "Campo obrigatório"),
  password: z.string().min(1, "Campo obrigatório"),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;

const cadastroSendSchema = z.object({
  caduser: z.string().min(1, "* Campo obrigatório"),
  cadpassword: z.string().min(1, "* Campo obrigatório"),
  telefone: z.string().min(1, "* Campo obrigatório"),
  cargo: z.string(),
  //nome: z.string().min(1, "Campo obrigatório"),
  //email: z.string().min(1, "Campo obrigatório"),
});
type cadastroSendSchema = z.infer<typeof cadastroSendSchema>;

export function Login() {
  const [isForm, setIsForm] = useState(1);
  const [cadLogin, setCadLogin] = useState("");
  const [passWord, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loadingCadastro, setLoadingCadastro] = useState(false);
  const [userLogin, setUserLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });

  const {
    register: registerCadastro,
    handleSubmit: handleCadastroSubmit,
    formState: { errors: cadastroErrors },
  } = useForm<cadastroSendSchema>({
    resolver: zodResolver(cadastroSendSchema),
  });

  const { login, loading } = useData() as {
    login: (data: unknown) => Promise<void>;
    loading: boolean;
  };
  const onSubmit = (data: infoSendSchema) => {
    login(data);
  };
  const onSubmitCadastro = (data: cadastroSendSchema) => {
    createUser(data);
  };

  const createUser = async (data: cadastroSendSchema) => {
    try {
      const response = await api.post("api/create/user/", data);
      const status = response.data.status;
      const msg = response.data.msg;
      if (status === "sucesso") {
        toast(msg, { type: "success", autoClose: 500 });
        setIsForm(1);
      } else {
        toast(msg, { type: "error", autoClose: 500 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Obrigado por visitar nossa página!");
    }
  };

  return (
    <>
      <Main>
        <div className="min-h-screen bg-gradient-to-br from-brand-100 via-brown-50 to-brand-200 flex items-center justify-center p-4 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-brand-50/30 to-transparent"></div>
          </div>

          <Card className="relative max-w-4xl w-full shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Panel - Hero Section */}
              <div className="lg:w-2/5 bg-gradient-to-br from-brand-500 via-brand-600 to-brown-600 p-8 lg:p-12 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <div className="mb-8 relative">
                    <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm">
                      <PersonStanding className="h-16 w-16 mx-auto" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                    </div>
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                    {isForm === 1 ? "Bem-vindo de volta!" : "Junte-se a nós!"}
                  </h1>

                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {isForm === 1
                      ? "Acesse sua conta e continue gerenciando seu negócio com facilidade."
                      : "Crie sua conta e comece a transformar seu negócio hoje mesmo."}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span className="text-sm text-white/90">
                        Controle total do estoque
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span className="text-sm text-white/90">
                        Relatórios detalhados
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span className="text-sm text-white/90">
                        Interface moderna e intuitiva
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Forms */}
              <div className="lg:w-3/5 p-8 lg:p-12 relative">
                {/* Form Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-brand-100 rounded-2xl">
                      <ShieldCheck className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Paula Kids
                      </h2>
                      <p className="text-gray-600 text-left">
                        Sistema de Gestão
                      </p>
                    </div>
                  </div>

                  {/* Toggle Buttons */}
                  <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                    <button
                      onClick={() => setIsForm(1)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isForm === 1
                          ? "bg-white text-brand-600 shadow-lg shadow-brand-100/50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </button>
                    <button
                      onClick={() => setIsForm(2)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isForm === 2
                          ? "bg-white text-brand-600 shadow-lg shadow-brand-100/50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      Cadastro
                    </button>
                  </div>
                </div>

                {/* Forms Container */}
                <div className="space-y-6">
                  {isForm === 1 ? (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Acesse sua conta
                        </h3>
                        <p className="text-gray-600">
                          Entre com suas credenciais para continuar
                        </p>
                      </div>
                      <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        {/* Email Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="user"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Mail className="h-4 w-4 text-brand-500" />
                            E-mail
                          </label>
                          <div className="relative">
                            <Input
                              id="user"
                              placeholder="Digite seu e-mail"
                              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              value={userLogin}
                              onInput={(e) =>
                                setUserLogin(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              {...register("user")}
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          {errors.user && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              {errors.user.message}
                            </div>
                          )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="password"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Lock className="h-4 w-4 text-brand-500" />
                            Senha
                          </label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPasswordLogin ? "text" : "password"}
                              placeholder="Digite sua senha"
                              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              value={passLogin}
                              onInput={(e) =>
                                setPassLogin(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              {...register("password")}
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswordLogin(!showPasswordLogin)
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPasswordLogin ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              {errors.password.message}
                            </div>
                          )}
                        </div>
                        {/* Login Button */}
                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando...
                              </>
                            ) : (
                              <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Entrar na Conta
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center pt-4">
                          <button
                            type="button"
                            className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                          >
                            Esqueceu sua senha?
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Cadastro Form */
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Criar nova conta
                        </h3>
                        <p className="text-gray-600">
                          Preencha os dados para criar sua conta
                        </p>
                      </div>
                      {/* Password Match Indicator */}
                      {(passWord || password2) && (
                        <div
                          className={`mb-4 p-3 rounded-xl border-2 ${
                            passWord === password2 && passWord !== ""
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {passWord === password2 && passWord !== "" ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">
                                  Senhas coincidem
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-700 font-medium">
                                  As senhas são diferentes
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      <form
                        className="space-y-6"
                        onSubmit={handleCadastroSubmit(onSubmitCadastro)}
                      >
                        <Input
                          type="hidden"
                          value="cliente"
                          {...registerCadastro("cargo")}
                        />

                        {/* Email Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="caduser"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Mail className="h-4 w-4 text-brand-500" />
                            E-mail
                          </label>
                          <div className="relative">
                            <Input
                              id="caduser"
                              type="email"
                              placeholder="Digite seu e-mail"
                              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              value={cadLogin}
                              onInput={(e) =>
                                setCadLogin(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              {...registerCadastro("caduser")}
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          {cadastroErrors.caduser && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              {cadastroErrors.caduser.message}
                            </div>
                          )}
                        </div>
                        {/* Phone Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="telefone"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Phone className="h-4 w-4 text-brand-500" />
                            Telefone (WhatsApp)
                          </label>
                          <div className="relative">
                            <Input
                              id="telefone"
                              type="tel"
                              placeholder="(31) 99999-9999"
                              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              {...registerCadastro("telefone")}
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          {cadastroErrors.telefone && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              {cadastroErrors.telefone.message}
                            </div>
                          )}
                        </div>
                        {/* Password Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="cadpassword"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Lock className="h-4 w-4 text-brand-500" />
                            Senha
                          </label>
                          <div className="relative">
                            <Input
                              id="cadpassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Digite sua senha"
                              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              value={passWord}
                              onInput={(e) =>
                                setPassword(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              {...registerCadastro("cadpassword")}
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {cadastroErrors.cadpassword && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              {cadastroErrors.cadpassword.message}
                            </div>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="password2"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            <Lock className="h-4 w-4 text-brand-500" />
                            Confirmar Senha
                          </label>
                          <div className="relative">
                            <Input
                              id="password2"
                              type={showPassword2 ? "text" : "password"}
                              placeholder="Confirme sua senha"
                              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                              value={password2}
                              onInput={(e) =>
                                setPassword2(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword2(!showPassword2)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword2 ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Register Button */}
                        <div className="pt-4">
                          <Button
                            type="submit"
                            className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                              passWord === password2 && passWord !== ""
                                ? "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={
                              loadingCadastro ||
                              passWord !== password2 ||
                              passWord === ""
                            }
                          >
                            {loadingCadastro ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando conta...
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Criar Conta
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Back to Login Link */}
                        <div className="text-center pt-4">
                          <span className="text-sm text-gray-600">
                            Já tem uma conta?{" "}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsForm(1)}
                            className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                          >
                            Fazer login
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <ToastContainer />
      </Main>
    </>
  );
}
