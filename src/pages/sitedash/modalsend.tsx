import React, { useState } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { api } from "../../services/api";
import { useData } from "../../components/context";
import { toast } from "react-toastify";
import {
  Barcode,
  ListChecks,
  MailCheck,
  MapPin,
  MessageCircleReply,
  ShoppingCart,
} from "lucide-react";
import { Input } from "../../components/ui/input";

type ProductCarrinho = {
  produto: string;
  nome_usuario: string;
  id_produto: number;
  quantidade: number;
  marca: string;
  codigo: string;
  cliente: string;
  preco: number;
  endereco: string;
  cadastro: string;
  contato: string;
  enviado: boolean;
  cidade: string;
  estado: string;
  email?: string;
};

interface iModalSend {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  item: ProductCarrinho | null;
}

export const ModalSendProduct: React.FC<iModalSend> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  item,
}) => {
  const [loading, setLoading] = useState(false);
  const { setProduct } = useData();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  const sendFile = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await api.post("api/import/products/", formData);
      const result = response.data;
      const status = result.status;
      const alert = result.msg;
      if (status === "sucesso") {
        closeModal();
        const newData = result.dados;
        const formatedProducts = newData.map((product) => ({
          ...product,
          preco: product.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          custo: product.custo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        }));
        setProduct(formatedProducts);
      } else {
        toast(alert, { type: "error", position: "top-left", autoClose: 1000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/80"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-4">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {titleModal}
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <form onSubmit={onSubmit} className="grid grid-cols-1">
              <div className="flex gap-2">
                <MapPin className="text-blue-600" /> {item?.endereco},{" "}
                {item?.cidade}, {item?.estado}
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div className="flex gap-2">
                  <MailCheck className="text-green-800" /> {item?.email}{" "}
                </div>
                <div className="flex gap-2">
                  <MessageCircleReply className="text-green-800" />{" "}
                  {item?.contato}
                </div>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div className="flex gap-2">
                  <ListChecks /> {item?.quantidade}
                </div>
                <div className="flex gap-2">
                  <Barcode /> {item?.codigo}
                </div>
              </div>
              <div className="grid grid-cols-1 mt-4 gap-4">
                <div className="flex gap-2 col-span-1">
                  <ShoppingCart className="text-blue-800" /> {item?.produto},{" "}
                  {item?.marca}
                </div>
              </div>
              <div className="grid grid-cols-1 mt-4 gap-4">
                <div className="space-y-2">
                  <Label>Código de rastreio</Label>
                  <Input />
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
                  Confirmar Envio
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
