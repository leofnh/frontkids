import { useState } from "react";
import { Nav } from "../../components/nav";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useData } from "../../components/context";
import { ModalCreateClient } from "./modalCliente";
import { TableBaseClient } from "./table";
import { DataCliente } from "../../components/types";

const infoSendSchema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  cpf: z.string().min(1, "Campo obrigatório"),
  idt: z.string().min(1, "Campo obrigatório"),
  dn: z.string().min(1, "Campo obrigatório"),
  rua: z.string().min(1, "Campo obrigatório"),
  bairro: z.string().min(1, "Campo obrigatório"),
  cidade: z.string().min(1, "Campo obrigatório"),
  numero: z.string().min(1, "Campo obrigatório"),
  sapato: z.string().min(1, "Campo obrigatório"),
  roupa: z.string().min(1, "Campo obrigatório"),
  telefone: z.string().min(1, "Campo obrigatório"),
  id: z.number(),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;

export function Clientes() {
  const { dataClient, setClient } = useData() as {
    dataClient: DataCliente[];
    setClient: (data: DataCliente[]) => void;
  };
  const [dataUpdate, setDataUpdate] = useState<DataCliente | undefined>(
    undefined
  );
  const [isUpdate, setIsUpdate] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });
  const setError = (error: unknown) => {
    console.error(error);
  };
  const setLoading = (loading: boolean) => {
    // Função para controlar loading (não utilizada atualmente)
    void loading;
  };
  const [isOpenCreateObject, setCreateObject] = useState(false);

  const dataHeaderclient: Array<keyof DataCliente> = [
    "nome",
    "cpf",
    "idt",
    "dn",
    "rua",
    "bairro",
    "numero",
    "cidade",
    "telefone",
    "sapato",
    "roupa",
  ];

  const openModal = () => {
    reset();
    setCreateObject(!isOpenCreateObject);
    setIsUpdate(false);
  };

  const notifySuccess = (text: string) =>
    toast.success(text, {
      theme: "light",
      autoClose: 500,
      position: "top-left",
    });

  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "light",
      autoClose: 500,
      position: "top-left",
    });

  function handleFilterProduct(data: infoSendSchema) {
    setLoading(true);
    const sendMethod = () => {
      if (isUpdate) {
        return api.put;
      } else {
        return api.post;
      }
    };
    const url = "api/clientes/";
    const requestMethod = sendMethod();

    const sendNewClient = async () => {
      try {
        const response = await requestMethod(url, data);
        const newDataResp = response.data;
        const alertView = newDataResp["msg"];
        const statusApi = newDataResp["status"];
        const newData = newDataResp["dados"];

        if (statusApi == "erro") {
          notifyError(alertView);
        } else if (statusApi == "sucesso") {
          setClient(newData);
          //setClient((prevDataClient) => [...prevDataClient, newData]);
          notifySuccess(alertView);
        }
      } catch (error) {
        notifyError("Houve algum erro na obtenção dos dados.");
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    sendNewClient();
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brown-50">
        <Nav />
        <ToastContainer
          position="top-right"
          toastClassName="!bg-white !text-brown-800 border border-brand-200 shadow-lg"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-brown-800 mb-2">
                  Gestão de Clientes
                </h1>
                <p className="text-brown-600">
                  Cadastre e gerencie informações dos seus clientes
                </p>
              </div>

              <Button
                className="bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 gap-2 px-6 py-3"
                onClick={openModal}
              >
                <span className="text-sm font-medium">+ Novo Cliente</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
            <TableBaseClient
              dataBody={dataClient}
              dataHeader={dataHeaderclient}
              setDataUpdate={setDataUpdate}
              setIsUpdate={setIsUpdate}
              setCreateObject={setCreateObject}
            />
          </div>

          <ModalCreateClient
            isOpen={isOpenCreateObject}
            closeModal={openModal}
            descriptionModal="Preencha todos os dados solicitados para concluir o cadastro."
            titleModal="Cadastro de clientes"
            handleFilterProduct={handleFilterProduct}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            update={isUpdate}
            dataUpdate={dataUpdate}
            setValue={setValue}
          />
        </main>
      </div>
    </>
  );
}
