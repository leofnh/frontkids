import React, { useState } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { api } from "../../services/api";
import { Input } from "../../components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { ImgProductType, ProductType } from "../../components/types";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useData } from "../../components/context";

interface iModalimport {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
  imgProduct: ImgProductType[];
  dataUpdate: ProductType;
}

export const ModalImage: React.FC<iModalimport> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  notifyError,
  notifySuccess,
  imgProduct,
  dataUpdate,
}) => {
  const [linkImg, setLinkImg] = useState("");
  const [loading, setLoading] = useState(false);
  const { setImgProduct } = useData() as {
    setImgProduct: (data: ImgProductType[]) => void;
  };

  // const { setProduct } = useData();
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (linkImg) {
      const formData = new FormData();
      const codigo_produto = dataUpdate.codigo;
      formData.append("id_produto", codigo_produto);
      formData.append("url", linkImg);
      await sendFile(formData);
    } else {
      notifyError("Informe o link para ser enviado.");
    }
  };

  const sendFile = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await api.post("api/add/image/products/", formData);
      const result = response.data;
      const status = result.status;
      const alert = result.msg;
      if (status === "sucesso") {
        notifySuccess(alert);
        closeModal();
        // const newData = result.dados;
        // console.log(newData);
      } else {
        notifyError(alert);
      }
    } catch (error) {
      console.error(error);
      notifyError("Ocorreu um erro ao enviar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  const sendImg = async (id: string) => {
    try {
      setLoading(true);
      console.log("ID: ", id);
      const data = new FormData();
      data.append("id", id);
      const response = await api.post("api/del/img-produto/", data);
      const status = response.data.status;
      const msg = response.data.msg;
      if (status == "sucesso") {
        const dados = response.data.dados;
        setImgProduct(dados);
        toast.success(msg);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmToast = (id: string, sendImg: (id: string) => void) => {
    const ToastContent = ({ closeToast }: { closeToast?: () => void }) => (
      <div className="flex flex-col gap-2">
        <span>Deseja deletar esta imagem?</span>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => {
              closeToast?.();
              toast.error("Ação cancelada.", {
                autoClose: 2000,
                position: "top-right",
              });
            }}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => {
              closeToast?.();
              sendImg(id);
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    );

    toast.info(<ToastContent />, {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      position: "top-left",
    });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <div className="relative left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[0%] gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {titleModal}
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1">
              <Carousel className="mr-10 ml-10 mt-4">
                <CarouselContent className="flex items-center text-center">
                  {imgProduct
                    .filter((img) => img.id_produto === dataUpdate.codigo)
                    .map((img) => (
                      <CarouselItem key={img.id_produto}>
                        <div className="flex w-full text-red-600">
                          <button
                            className="ml-auto"
                            onClick={() =>
                              confirmToast(String(img.id), sendImg)
                            }
                          >
                            <X />
                          </button>
                        </div>
                        <img src={img.url} className="w-full h-[300px]" />
                      </CarouselItem>
                    ))}
                </CarouselContent>
                {imgProduct.some(
                  (img) => img.id_produto === dataUpdate.codigo
                ) && (
                  <>
                    <CarouselPrevious className="bg-black text-white" />
                    <CarouselNext className="bg-black text-white" />
                  </>
                )}
              </Carousel>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 mt-4">
              <div className="grid grid-cols-1 mt-4 gap-8">
                <div className="space-y-2">
                  <Label>Link da imagem</Label>
                  <Input
                    placeholder="Ex: https://i.imgur.com/lxn1B9v.png"
                    onChange={(e) => setLinkImg(e.target.value)}
                    type="url"
                  />
                </div>
              </div>

              <div className="flex mt-5 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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
                  disabled={loading}
                >
                  Cadastrar Imagem
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
