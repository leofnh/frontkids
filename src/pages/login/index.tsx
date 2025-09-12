import { PersonStanding } from "lucide-react";
import { Main } from "../../components/main";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useData } from "../../components/context";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";
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
  const [isCadOk, setIsCadOk] = useState(false);
  const [userLogin, setUserLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
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

  const { login, loading } = useData();
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
        toast(msg, { type: "success", autoClose: 2000 });
        setIsForm(1);
      } else {
        toast(msg, { type: "error" });
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
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
          <Card className="max-w-4xl shadow-lg rounded-lg sm:w-[500px] w-[400px]">
            <div className="flex flex-col md:flex-row">
              <div className="flex rounded-lg items-center justify-center md:w-1/3 bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
                <PersonStanding className="h-24 w-24" />
              </div>
              {isForm === 1 ? (
                <>
                  <CardContent className="md:w-2/3 p-8">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl font-bold">
                        Logando...
                      </CardTitle>
                    </CardHeader>
                    <form
                      className="space-y-6"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="user"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Usuário (e-mail)
                        </label>
                        <Input
                          id="user"
                          type="text"
                          placeholder="meu@email.com"
                          className="w-full"
                          value={userLogin}
                          onInput={(e) => setUserLogin(e.target.value)}
                          {...register("user")}
                        />
                        {errors.user && (
                          <p className="text-sm text-red-600">
                            {errors.user.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Senha
                        </label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="w-full"
                          value={passLogin}
                          onInput={(e) => setPassLogin(e.target.value)}
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <Button
                          type="button"
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => setIsForm(2)}
                        >
                          Novo Cadastro
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardContent className="md:w-2/3 p-8">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl font-bold">
                        <span>Cadastrando...</span>
                        <p>
                          {passWord !== password2 ? (
                            <>
                              {isCadOk ? setIsCadOk(false) : ""}
                              <Badge className="bg-red-600 hover:bg-red-600">
                                As senhas são diferentes!
                              </Badge>
                            </>
                          ) : (
                            <>{!isCadOk ? setIsCadOk(true) : ""}</>
                          )}
                        </p>
                      </CardTitle>
                    </CardHeader>
                    <form
                      className="space-y-6"
                      onSubmit={handleCadastroSubmit(onSubmitCadastro)}
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="user"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Usuário (e-mail)
                        </label>
                        <Input
                          type="hidden"
                          value="cliente"
                          {...registerCadastro("cargo")}
                        />
                        <Input
                          type="email"
                          placeholder="ex: meu@email.com"
                          className="w-full"
                          value={cadLogin}
                          onInput={(e) => setCadLogin(e.target.value)}
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
                          Telefone (Whatsapp)
                        </label>
                        <Input
                          type="telefone"
                          placeholder="(31)99999-9999"
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
                          value={passWord}
                          onInput={(e) => setPassword(e.target.value)}
                          {...registerCadastro("cadpassword")}
                        />
                        {cadastroErrors.cadpassword && (
                          <p className="text-sm text-red-600">
                            {cadastroErrors.cadpassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="password2"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Repita a Senha
                        </label>
                        <Input
                          id="password2"
                          type="password"
                          placeholder="••••••••"
                          className="w-full"
                          value={password2}
                          onInput={(e) => setPassword2(e.target.value)}
                        />
                        {cadastroErrors.password && (
                          <p className="text-sm text-red-600">
                            {cadastroErrors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {isCadOk ? (
                          <>
                            <Button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              disabled={loading}
                            >
                              {loading ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                          </>
                        ) : (
                          ""
                        )}

                        <Button
                          type="button"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => setIsForm(1)}
                        >
                          Logar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              )}
            </div>
          </Card>
        </div>
        <ToastContainer />
      </Main>
    </>
  );
}
