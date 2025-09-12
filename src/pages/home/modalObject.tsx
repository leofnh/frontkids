import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { api } from "../../services/api";

const infoSendSchema = z.object({
  ano: z.string(),
  usuario: z.string(),
});

type infoSendSchema = z.infer<typeof infoSendSchema>;

export function ModalObject() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(!isModalOpen);
  const { register, handleSubmit } = useForm<infoSendSchema>({
    resolver: zodResolver(infoSendSchema),
  });
  const notifyError = (text: string) =>
    toast.error(text, {
      theme: "colored",
    });
  const notifySuccess = (text: string) =>
    toast.success(text, {
      theme: "colored",
    });
  const [dataPca, setDataPca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            autoClose: 1500,
          },
          error: {
            render: "Erro ao enviar os dados...",
            autoClose: 2000,
          },
        });
        const newData = response.data;
        const statusApi = newData["status"];
        const alertView = newData["msg"];
        if (statusApi == "erro") {
          notifyError(alertView);
        } else if (statusApi == "sucesso") {
          notifySuccess(alertView);
        }
        setDataPca(newData);
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-app-green hover:bg-app-green rounded-lg p-4 h-7">
            Iniciar PCA
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[1280px]">
          <DialogHeader>
            <DialogTitle>Iniciando PCA</DialogTitle>
            <DialogDescription>
              <span className="">
                Informe a data limite para conclusão do PCA.
              </span>
            </DialogDescription>
            <form
              onSubmit={handleSubmit(handleFilterProduct)}
              className="grid grid-cols-1"
            >
              <div className="col-span-1 mt-2">
                <Label>Data para conclusão</Label>
                <Input
                  type="date"
                  className="mt-1 w-auto"
                  {...register("ano")}
                />
                <Input type="hidden" {...register("usuario")} value="1" />
              </div>

              <DialogFooter className="flex text-center items-center">
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
              </DialogFooter>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
