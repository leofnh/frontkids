import { ClipboardPaste, ClipboardPenLine, Search } from "lucide-react";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import { Input } from "../../components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState, useEffect, SetStateAction } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button";
import { ModalCreatePca } from "./modalCreatePca";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const infoSendSchema = z.object({
  ano: z.string(),
  usuario: z.string(),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });

  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const notifySuccess = (text: string) =>
    toast.success(text, {
      theme: "light",
      autoClose: 500,
    });
  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "light",
      autoClose: 500,
    });

  const [dataPca, setDataPca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getPca = async () => {
      try {
        const response = await toast.promise(api.post("api/get-pca/"), {
          pending: {
            render: "Carregando...",
            autoClose: 3000,
          },
          success: {
            render: "Dados carregado com sucesso!",
            autoClose: 1000,
          },
          error: {
            render: "Erro ao carregar os dados...",
            autoClose: 1000,
          },
        });
        const newData = response.data.pca;
        setDataPca(newData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getPca();
  }, []);

  if (error) {
    notifyError("Erro ao buscar dados!");
  }

  const handleSearchTerm = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataTable = dataPca.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleFilterProduct(data: infoSendSchema) {
    setLoading(true);

    const sendNewPca = async () => {
      try {
        const response = await toast.promise(api.post("start-pca/", data), {
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
        const newData = response.data;
        const statusApi = newData["responseStatus"];
        const alertView = newData["msg"];

        if (statusApi == "erro") {
          notifyError(alertView);
        } else if (statusApi == "sucesso") {
          const formattedData = {
            ano: newData["ano_criado"],
            criado: newData["criado"],
            nome: "Plano de Contratação Anual",
            pk: newData["pca_id"],
            solicitante: "admin",
            status: newData["status"],
            usuario: newData["usuario"],
            valor: "0,00",
          };

          setDataPca((prevDataPca) => [...prevDataPca, formattedData]);
          notifySuccess(alertView);
        }
      } catch (error) {
        notifyError("Houve algum erro na obtenção dos dados.");
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    sendNewPca();
  }

  return (
    <>
      <Main className="bg-app-bg-color">
        <Nav></Nav>
        <div className="m-10">
          <div className="flex justify-between">
            <div className="flex">
              <Input
                className="w-25 h-8 gap-2 border border-black focus:outline-none
                 focus:border-transparent
                 rounded-[8px]"
                placeholder="Pesquise o PCA..."
                value={searchTerm}
                onInput={handleSearchTerm}
              />
              <Search className="ml-2 cursor-pointer" />
              <ToastContainer />
            </div>

            <div>
              <Button
                className="bg-app-green hover:bg-app-green rounded-lg p-4 h-7"
                onClick={openModal}
              >
                Iniciar PCA
              </Button>
              <ModalCreatePca
                isOpen={isModalOpen}
                closeModal={closeModal}
                titleModal="Iniciando modal"
                descriptionModal="Informe a data limite para conclusão do PCA."
                handleFilterProduct={handleFilterProduct}
                handleSubmit={handleSubmit}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="text-center m-1">
          <Table>
            <TableCaption>Lista de PCA's</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Iniciado em</TableHead>
                <TableHead>Conclusão</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Solicitante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse">
              {filteredDataTable.map((item, index) => (
                <TableRow key={index} className="text-left">
                  <TableCell className="border-b-2 border-dashed">
                    {item.status}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.nome}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.criado}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.ano}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.valor}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.solicitante}
                  </TableCell>

                  <TableCell className="border-b-2 border-dashed gap-2 flex">
                    <a href={"/objetos/" + item.pk}>
                      <ClipboardPenLine className="text-blue-800" />
                    </a>
                    <a
                      href={
                        "https://pcasdp.pythonanywhere.com/dados/pca/" +
                        item.pk +
                        "/"
                      }
                      target="__blank"
                    >
                      <ClipboardPaste className="cursor-pointer text-green-800" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  );
}
