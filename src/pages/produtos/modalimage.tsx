import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  Upload,
  Link2,
  Trash2,
  Eye,
  Plus,
  Loader2,
  Camera,
  ZoomIn,
  Images,
} from "lucide-react";
import { Modal } from "../../components/modalBase";
import "../../styles/modal-image.css";
import { Button } from "../../components/ui/button";
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
import { toast } from "react-toastify";
import { useData } from "../../components/context";

interface iModalimport {
  isOpen: boolean;
  closeModal: () => void;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
  imgProduct: ImgProductType[];
  dataUpdate: ProductType;
}

export const ModalImage: React.FC<iModalimport> = ({
  isOpen,
  closeModal,
  notifyError,
  notifySuccess,
  imgProduct,
  dataUpdate,
}) => {
  const [linkImg, setLinkImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const { setImgProduct } = useData() as {
    setImgProduct: (data: ImgProductType[]) => void;
  };

  // const { setProduct } = useData();
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!linkImg.trim()) {
      notifyError("Por favor, informe o link da imagem.");
      return;
    }

    // Validação básica de URL
    try {
      new URL(linkImg);
    } catch {
      notifyError("Por favor, informe uma URL válida.");
      return;
    }

    const formData = new FormData();
    const codigo_produto = dataUpdate.codigo;
    formData.append("id_produto", codigo_produto);
    formData.append("url", linkImg);
    await sendFile(formData);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="h-[90vh] w-full max-w-6xl flex flex-col bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Heroico */}
          <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 p-6 text-white">
            <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Images className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                      Galeria de Imagens
                    </h2>
                    <p className="text-orange-100 text-sm md:text-lg font-medium">
                      Código: {dataUpdate.codigo}
                    </p>
                  </div>
                </div>

                {/* Botão Fechar */}
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
                >
                  <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-orange-100">
                <Camera className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {
                    imgProduct.filter(
                      (img) => img.id_produto === dataUpdate.codigo
                    ).length
                  }
                  {imgProduct.filter(
                    (img) => img.id_produto === dataUpdate.codigo
                  ).length === 1
                    ? " imagem"
                    : " imagens"}{" "}
                  carregadas
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal com Scroll */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Galeria de Imagens */}
              {imgProduct.filter((img) => img.id_produto === dataUpdate.codigo)
                .length > 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Imagens Atuais
                      </h3>
                      <p className="text-gray-600">
                        Gerencie as imagens do produto
                      </p>
                    </div>
                  </div>

                  <Carousel className="relative">
                    <CarouselContent>
                      {imgProduct
                        .filter((img) => img.id_produto === dataUpdate.codigo)
                        .map((img, index) => (
                          <CarouselItem key={img.id}>
                            <div className="relative group">
                              {/* Botão de exclusão */}
                              <div className="absolute top-4 right-4 z-10">
                                <button
                                  onClick={() =>
                                    confirmToast(String(img.id), sendImg)
                                  }
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Imagem */}
                              <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                                <img
                                  src={img.url}
                                  alt={`Imagem ${index + 1}`}
                                  className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay com informações */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="flex items-center justify-between text-white">
                                    <span className="text-sm font-medium">
                                      Imagem {index + 1}
                                    </span>
                                    <button
                                      onClick={() =>
                                        window.open(img.url, "_blank")
                                      }
                                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                      <ZoomIn className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-2 border-gray-300 text-gray-700 hover:text-gray-900 shadow-lg" />
                    <CarouselNext className="right-4 bg-white/90 hover:bg-white border-2 border-gray-300 text-gray-700 hover:text-gray-900 shadow-lg" />
                  </Carousel>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-2xl">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Nenhuma imagem encontrada
                      </h3>
                      <p className="text-gray-500">
                        Adicione a primeira imagem do produto usando o
                        formulário abaixo
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário para Adicionar Nova Imagem */}
              <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-200/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Adicionar Nova Imagem
                    </h3>
                    <p className="text-gray-600">
                      Cole o link da imagem para adicionar à galeria
                    </p>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Link2
                        className={`h-5 w-5 transition-colors duration-300 ${
                          inputFocused ? "text-orange-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={linkImg}
                      onChange={(e) => setLinkImg(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      className={`pl-12 py-4 text-lg border-2 transition-all duration-300 ${
                        inputFocused
                          ? "border-orange-500 ring-4 ring-orange-100"
                          : "border-gray-200 hover:border-orange-300"
                      } rounded-xl bg-white/80 backdrop-blur-sm`}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="outline"
                      className="flex-1 py-3 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300"
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Adicionar Imagem
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
