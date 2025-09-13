import React, { useState, useRef } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { api } from "../../services/api";
import { useData } from "../../components/context";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  FileX,
  CloudUpload,
  Database,
  ArrowRight,
} from "lucide-react";

interface iModalimport {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
}

interface ProductData {
  preco: number;
  custo: number;
  [key: string]: unknown;
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
  const { setProduct } = useData() as {
    setProduct: (products: unknown[]) => void;
  };
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
        const formatedProducts = newData.map((product: ProductData) => ({
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
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      {/* Modal Content */}
      <div className="bg-white rounded-2xl border border-brand-200 shadow-2xl shadow-brand-900/10 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-50 to-blue-50 px-6 py-5 border-b border-brand-200">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/80 hover:bg-white border border-brand-200 text-brown-600 hover:text-brown-800 transition-all duration-200 hover:scale-105"
          >
            <X size="18" />
          </button>

          <div className="flex items-center gap-4 pr-12">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-brand-500 to-blue-500 rounded-xl shadow-lg">
                <CloudUpload size="24" className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white">
                <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-800">{titleModal}</h2>
              <p className="text-sm text-brown-600 mt-1">{descriptionModal}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={onSubmit} className="p-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FileSpreadsheet
                size="20"
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Instruções de Importação
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Apenas arquivos Excel (.xlsx) são aceitos</li>
                  <li>• Certifique-se de usar o modelo correto</li>
                  <li>• Dados existentes serão atualizados</li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-brown-700 flex items-center gap-2">
              <Upload size="16" className="text-brand-600" />
              Selecionar Arquivo Excel
            </Label>

            <div className="relative">
              <div
                className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                  fileX
                    ? "border-green-300 bg-green-50"
                    : "border-brand-300 bg-brand-50 hover:border-brand-400 hover:bg-brand-100"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onChageFile}
                  accept=".xlsx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">
                  {fileX ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 size="24" className="text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-green-800">
                          {fileX.name}
                        </p>
                        <p className="text-sm text-green-600">
                          Arquivo selecionado
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3 bg-brand-100 rounded-xl">
                          <FileSpreadsheet
                            size="32"
                            className="text-brand-600"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-brown-800">
                          Clique para selecionar
                        </p>
                        <p className="text-sm text-brown-600">
                          ou arraste o arquivo aqui
                        </p>
                        <p className="text-xs text-brown-500 mt-1">
                          Apenas arquivos .xlsx
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {fileX && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                >
                  <FileX size="16" />
                </button>
              )}
            </div>
          </div>

          {/* Download Template */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size="18" className="text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Modelo de Importação
                  </p>
                  <p className="text-xs text-gray-600">
                    Baixe o template Excel
                  </p>
                </div>
              </div>
              <Button
                type="button"
                className="px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Baixar
              </Button>
            </div>
          </div>

          {/* Process Preview */}
          {fileX && (
            <div className="mt-6 bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Database size="18" className="text-brand-600" />
                <p className="text-sm font-semibold text-brand-800">
                  Processo de Importação
                </p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-brand-700">
                  <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                  Arquivo Excel
                </div>
                <ArrowRight size="16" className="text-brand-500" />
                <div className="flex items-center gap-2 text-brand-700">
                  <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                  Validação
                </div>
                <ArrowRight size="16" className="text-brand-500" />
                <div className="flex items-center gap-2 text-brand-700">
                  <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                  Database
                </div>
              </div>
            </div>
          )}

          {/* Warning if no file */}
          {!fileX && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size="18"
                  className="text-orange-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Atenção
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Selecione um arquivo Excel para continuar com a importação.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <X size="18" />
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading || !fileX}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                loading || !fileX
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white hover:shadow-brand-500/25"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size="18" className="animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload size="18" />
                  Importar Produtos
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
