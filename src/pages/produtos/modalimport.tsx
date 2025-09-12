import React, { useState, useRef } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { api } from "../../services/api";
import { useData } from "../../components/context";

interface iModalimport {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
}

export const ModalImportProduct: React.FC<iModalimport> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  notifyError,
  notifySuccess,
}) => {
  const [fileX, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Adiciona um ref ao input de arquivo
  const { setProduct } = useData();
  const onChageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (fileExtension === "xlsx") {
        setFile(file);
      } else {
        notifyError(
          "O formato do arquivo é inválido, verifique se está sendo carregado o modelo em xlsx."
        );
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Limpa o input de arquivo
        }
      }
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o recarregamento da página

    if (fileX) {
      const formData = new FormData();
      formData.append("file", fileX);
      await sendFile(formData);
    } else {
      notifyError("Escolha um arquivo para ser enviado.");
    }
  };

  const sendFile = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await api.post("api/import/products/", formData);
      const result = response.data;
      const status = result.status;
      const alert = result.msg;
      if (status === "sucesso") {
        notifySuccess(alert);
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
        notifyError(alert);
      }
    } catch (error) {
      console.log(error);
      notifyError("Ocorreu um erro ao enviar o arquivo.");
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
              <div className="grid grid-cols-2 mt-4 gap-8">
                <Label className="block">
                  <span className="sr-only">Escolher arquivo</span>
                  <input
                    type="file"
                    ref={fileInputRef} // Liga o ref ao input
                    onChange={onChageFile}
                    accept=".xlsx"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-violet-50 file:text-violet-700
                       hover:file:bg-violet-100"
                  />
                </Label>
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
                  Importar Dados
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
