import { Search } from "lucide-react";
import { Main } from "../../components/main";
import { Nav } from "../../components/nav";
import { Input } from "../../components/ui/input";
import { sheetListItems } from "./sheetItems";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../services/api";
import { ModalItem } from "./modalItems";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalCreateObject } from "./modalCreateObject";

const infoSendSchema = z.object({
  ano: z.string(),
  usuario: z.string(),
});
type infoSendSchema = z.infer<typeof infoSendSchema>;

export function ObjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetListOpen, setSheetList] = useState(true);
  const [isModalObjectOpen, setModalObject] = useState(true);
  const [isModalItem, setModalItem] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id_pca } = useParams<{ id_pca: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dataItem, setDataItem] = useState([]);
  const { register, handleSubmit } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });

  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  function handleFilterProduct(data: infoSendSchema) {
    setLoading(true);

    const sendNewPca = async () => {
      try {
        const response = await toast.promise(api.post("teste/", data), {
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

  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "colored",
    });

  useEffect(() => {
    const getPcaItems = async () => {
      try {
        const response = await toast.promise(
          api.post("api/get-items/" + id_pca + "/"),
          {
            pending: {
              render: "Carregando...",
              autoClose: 3000,
            },
            success: {
              render: "Dados carregado com sucesso!",
              autoClose: 1500,
            },
            error: {
              render: "Erro ao carregar os dados...",
              autoClose: 2000,
            },
          }
        );
        const newData = response.data.objetos;
        const newDataItem = response.data.items;
        setDataItem(newDataItem);
        setData(newData);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getPcaItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    notifyError("Erro ao buscar dados!");
  }

  const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataTable = data.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modalidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Main>
        <Nav></Nav>
        <ToastContainer />
        <div className="m-10">
          <div className="flex justify-between">
            <div className="flex">
              <Input
                className="w-25 h-8 gap-2 border border-black focus:outline-none
                 focus:border-transparent
                 rounded-[8px]"
                placeholder="Pesquise o objeto..."
                value={searchTerm}
                onInput={handleSearchTerm}
              />
              <Search className="ml-2 cursor-pointer" />
            </div>
            <div>
              <Button
                className="bg-app-green hover:bg-app-green rounded-lg p-4 h-7"
                onClick={openModal}
              >
                Criar Objeto
              </Button>
              <ModalCreateObject
                isOpen={isModalOpen}
                closeModal={openModal}
                titleModal="Criando Objetos"
                descriptionModal="Inclua licitações que são pertinentes para o planejamento anual, é importante ser o mais assertivo possível."
                handleFilterProduct={handleFilterProduct}
                handleSubmit={handleSubmit}
                register={register}
              />
            </div>
          </div>
        </div>

        <div className="text-center m-10">
          <Table>
            <TableCaption>Lista de Objetos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Objeto</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Unidade requisitora</TableHead>
                <TableHead>Data estimada da contratação</TableHead>
                <TableHead>Valor estimado</TableHead>
                <TableHead>Quantitativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-collapse">
              {filteredDataTable.map((item, index) => (
                <TableRow key={index} className="text-left">
                  <TableCell className="border-b-2 border-dashed">
                    <Badge className="bg-yellow-500 hover:bg-green-600">
                      Pendente
                    </Badge>
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.nome}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.modalidade}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.setor}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.data_estimada}
                  </TableCell>
                  <TableCell className="border-b-2 border-dashed">
                    {item.valor_estimado}
                  </TableCell>

                  <TableCell className="border-b-2 border-dashed">
                    <div className="flex flex-row gap-3 ml-2">
                      {isModalItem && <ModalItem />}
                      {isSheetListOpen && sheetListItems(item, dataItem)}
                    </div>
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
