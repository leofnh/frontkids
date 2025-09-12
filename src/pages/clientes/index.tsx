import { useState } from "react";
import { Main } from "../../components/main";
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
  id: z.string(),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;

export function Clientes() {
  const { dataClient, setClient } = useData() as {
    dataClient: infoSendSchema;
    setClient: (data: infoSendSchema) => infoSendSchema;
  };
  const [dataUpdate, setDataUpdate] = useState();
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
  const [errorInfo, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenCreateObject, setCreateObject] = useState(false);

  const dataHeaderclient = [
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
        const response = await toast.promise(requestMethod(url, data), {
          pending: {
            render: "Carregando...",
            autoClose: 3000,
          },
          success: {
            render: "Dados enviado com sucesso!",
            autoClose: 1000,
          },
          error: {
            render: "Erro ao enviar os dados...",
            autoClose: 1500,
          },
        });
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
      <Main className="text-app-text-color">
        <Nav></Nav>
        <div>
          <ToastContainer />
          <div className="flex mt-4 ml-24">
            <Button
              className="text-app-text-color bg-gray-700 rounded-lg space-x-1 h-7"
              onClick={openModal}
            >
              <span>Novo Cliente</span>
            </Button>
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
          </div>
        </div>
        <div className="mt-4 m-20">
          <TableBaseClient
            dataBody={dataClient}
            dataHeader={dataHeaderclient}
            setDataUpdate={setDataUpdate}
            setIsUpdate={setIsUpdate}
            setCreateObject={setCreateObject}
          />
        </div>
      </Main>
    </>
  );
}
