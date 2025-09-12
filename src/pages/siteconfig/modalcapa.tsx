import { Modal } from "../../components/modalBase";
import { Input } from "../../components/ui/input";
import { useData } from "../../components/context";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { api } from "../../services/api";
import { ImgSlide } from "../../components/types";
import { ToastContainer } from "react-toastify";

interface iModalSiteConfig {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
}

export const ModalConfigCapa: React.FC<iModalSiteConfig> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
}) => {
  const { isImgSlide, setImgSlide, notifySuccess, notifyError } = useData() as {
    isImgSlide: ImgSlide[];
    setImgSlide: (data: ImgSlide[]) => ImgSlide[];
    notifySuccess: (text: string) => string;
    notifyError: (text: string) => string;
  };
  const imgSlide = [
    "https://i.imgur.com/ePrwFPI.jpeg",
    "https://i.imgur.com/IWQ1JXM.jpeg",
    "https://i.imgur.com/ScrceA6.jpeg",
  ];
  const [linkFoto, setLinkFoto] = useState("");
  const handleLinkFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkFoto(event.target.value);
  };
  const sendNewFoto = () => {
    const sendApi = async () => {
      const data = new FormData();
      if (linkFoto) {
        data.append("url", linkFoto);
        const response = await api.post("api/get/imgslide/", data);
        const dados = response.data.dados;
        const status = response.data.status;
        const msg = response.data.msg;
        if (status == "sucesso") {
          setImgSlide(dados);
          notifySuccess(msg);
        } else {
          notifyError(msg);
        }
      } else {
        notifyError("Preencha o link para enviar.");
      }
    };
    sendApi();
  };
  const sendDelFoto = async (id_foto: number) => {
    const response = await api.delete("api/get/imgslide/", {
      data: { id_foto },
    });
    const status = response.data.status;
    const msg = response.data.msg;
    if (status == "sucesso") {
      const dados = response.data.dados;
      setImgSlide(dados);
      notifySuccess(msg);
    } else {
      notifyError(msg);
    }
  };
  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        // overlayClassName="fixed inset-0 z-50 bg-black/80"
      >
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-gray-100 p-6 shadow-lg sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col items-center text-center sm:text-left gap-4">
            <div className="text-lg font-semibold leading-none tracking-tight gap-4  w-full">
              <div className="flex">
                <span> {titleModal}</span>
                <div className="ml-auto">
                  <button className="text-red-600" onClick={closeModal}>
                    <X />
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {descriptionModal}
              </div>
            </div>
            <div>
              <Carousel className="w-full max-w-xs bg-gray-100">
                <CarouselContent>
                  {isImgSlide.length > 0
                    ? isImgSlide.map((foto, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="p-1 bg-gray-100">
                              <div className="flex">
                                <div className="ml-auto gap-4">
                                  <button onClick={() => sendDelFoto(foto.id)}>
                                    <X className="text-red-600" />
                                  </button>
                                </div>
                              </div>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <img
                                  src={foto.url}
                                  className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))
                    : imgSlide.map((foto, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="p-1 bg-gray-100">
                              <div className="flex"></div>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <img
                                  src={foto}
                                  className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex gap-4 w-full">
              <div className="w-full">
                <Input
                  type="url"
                  placeholder="Preencha com o link da imagem."
                  onChange={handleLinkFoto}
                  value={linkFoto}
                />
              </div>
              <Button
                className="bg-gray-700 hover:bg-gray-800"
                onClick={() => sendNewFoto()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
