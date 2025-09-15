import React, { useState, useRef } from "react";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
//import { api } from "../../services/api";
//import { useData } from "../../components/context";
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
  BarChart3,
  Clock,
  Zap,
  Info,
} from "lucide-react";

interface iModalimport {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
}

// interface ProductData {
//   preco: number;
//   custo: number;
//   [key: string]: unknown;
// }

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
  const [progress, setProgress] = useState<{
    processed: number;
    total: number;
    percentage: number;
    created: number;
    updated: number;
    errors: number;
    status: string;
  } | null>(null);
  const [useProgressMode, setUseProgressMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { setProduct } = useData() as {
  //   setProduct: (products: unknown[]) => void;
  // };
  const onChageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (fileExtension === "xlsx") {
        setFile(file);
        // Sugere modo de progresso para arquivos > 2MB (aproximadamente 1000+ produtos)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 2) {
          setUseProgressMode(true);
        } else {
          setUseProgressMode(false);
        }
      } else {
        notifyError(
          "O formato do arquivo é inválido, verifique se está sendo carregado o modelo em xlsx."
        );
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
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
      if (useProgressMode) {
        // Modo com progresso para arquivos grandes
        await sendFileWithProgress(formData);
      } else {
        // Modo padrão com estatísticas
        await sendFileWithProgress(formData);
      }
    } catch (error) {
      console.log(error);
      notifyError("Ocorreu um erro ao enviar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  // const sendFileStandard = async (formData: FormData) => {
  //   const response = await api.post("api/import/products/", formData);
  //   const result = response.data;

  //   if (result.status === "sucesso") {
  //     const stats = result.statistics;
  //     let message = `Importação concluída! ${stats.created} produtos criados, ${stats.updated} atualizados.`;

  //     if (stats.errors > 0) {
  //       message += ` ${stats.errors} produtos com erro.`;
  //       notifyError(message);
  //     } else {
  //       notifySuccess(message);
  //     }

  //     closeModal();
  //     const newData = result.dados;
  //     const formatedProducts = newData.map((product: ProductData) => ({
  //       ...product,
  //       preco: product.preco.toLocaleString("pt-BR", {
  //         style: "currency",
  //         currency: "BRL",
  //       }),
  //       custo: product.custo.toLocaleString("pt-BR", {
  //         style: "currency",
  //         currency: "BRL",
  //       }),
  //     }));
  //     setProduct(formatedProducts);
  //   } else {
  //     notifyError(result.msg);
  //   }
  // };

  const sendFileWithProgress = async (formData: FormData) => {
    const response = await fetch(
      "https://api.paulakids.aelsistemas.com/api/import/products/",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Não foi possível ler a resposta");
    }

    let buffer = "";

    let reading = true;
    while (reading) {
      const { done, value } = await reader.read();

      if (done) {
        reading = false;
        break;
      }

      const chunk = new TextDecoder().decode(value);
      buffer += chunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Mantém a última linha incompleta

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.substring(6));

            if (data.status === "progresso") {
              setProgress(data.progress);
            } else if (data.status === "concluido") {
              notifySuccess("Importação finalizada com sucesso!");
              closeModal();
              // Recarregar produtos
              window.location.reload();
            } else if (data.status === "erro") {
              notifyError(data.msg);
              break;
            }
          } catch (e) {
            console.warn("Erro ao parsear linha:", line);
          }
        }
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      {/* Modal Content */}
      <div className="bg-white rounded-2xl border border-brand-200 shadow-2xl shadow-brand-900/10 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 mx-4 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-50 to-blue-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-brand-200 flex-shrink-0">
          <button
            onClick={closeModal}
            className="absolute right-2 sm:right-4 top-3 sm:top-4 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white border border-brand-200 text-brown-600 hover:text-brown-800 transition-all duration-200 hover:scale-105"
          >
            <X size="16" className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
            <div className="relative flex-shrink-0">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-brand-500 to-blue-500 rounded-lg sm:rounded-xl shadow-lg">
                <CloudUpload size="20" className="text-white sm:w-6 sm:h-6" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full border-2 border-white">
                <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-brown-800 truncate">
                {titleModal}
              </h2>
              <p className="text-xs sm:text-sm text-brown-600 mt-0.5 sm:mt-1 line-clamp-2">
                {descriptionModal}
              </p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable Area */}
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-300 scrollbar-track-brand-50 hover:scrollbar-thumb-brand-400"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f8fafc",
          }}
        >
          <form
            onSubmit={onSubmit}
            className="p-4 sm:p-6 pr-2 sm:pr-4 space-y-4 sm:space-y-6"
          >
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <FileSpreadsheet
                  size="18"
                  className="text-blue-600 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-blue-800">
                    Instruções de Importação
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1">
                    <li>• Apenas arquivos Excel (.xlsx) são aceitos</li>
                    <li>• Certifique-se de usar o modelo correto</li>
                    <li>
                      • Dados existentes serão atualizados automaticamente
                    </li>
                    <li className="hidden sm:list-item">
                      • Arquivos grandes (&gt;2MB) usam modo de progresso
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mode Selection for Large Files */}
            {fileX && useProgressMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info
                    size="18"
                    className="text-yellow-600 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-yellow-800">
                      Arquivo Grande Detectado
                    </p>
                    <p className="text-xs text-yellow-700 mt-1 mb-3">
                      Seu arquivo é grande (
                      {(fileX.size / (1024 * 1024)).toFixed(1)}MB). Recomendamos
                      o modo de progresso para melhor experiência.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => setUseProgressMode(false)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          !useProgressMode
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Zap size="14" />
                          <span className="hidden xs:inline">Modo </span>Rápido
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseProgressMode(true)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          useProgressMode
                            ? "bg-green-500 text-white"
                            : "bg-white text-green-600 border border-green-200 hover:bg-green-50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 size="14" />
                          Com Progresso
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Display */}
            {loading && progress && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <Clock
                    size="16"
                    className="text-green-600 flex-shrink-0 sm:w-[18px] sm:h-[18px]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-green-800">
                      Importando Produtos...
                    </p>
                    <p className="text-xs text-green-600">
                      {progress.processed} de {progress.total} produtos (
                      {progress.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs">
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded border">
                    <div className="font-semibold text-green-600 text-sm sm:text-base">
                      {progress.created}
                    </div>
                    <div className="text-green-500 text-xs">Criados</div>
                  </div>
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded border">
                    <div className="font-semibold text-blue-600 text-sm sm:text-base">
                      {progress.updated}
                    </div>
                    <div className="text-blue-500 text-xs">Atualizados</div>
                  </div>
                  <div className="text-center p-1.5 sm:p-2 bg-white rounded border">
                    <div className="font-semibold text-red-600 text-sm sm:text-base">
                      {progress.errors}
                    </div>
                    <div className="text-red-500 text-xs">Erros</div>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-xs sm:text-sm font-semibold text-brown-700 flex items-center gap-2">
                <Upload size="14" className="text-brand-600 sm:w-4 sm:h-4" />
                Selecionar Arquivo Excel
              </Label>

              <div className="relative">
                <div
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 transition-all duration-300 ${
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
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <CheckCircle2
                            size="20"
                            className="text-green-600 sm:w-6 sm:h-6"
                          />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <p className="font-semibold text-green-800 text-xs sm:text-sm truncate">
                            {fileX.name}
                          </p>
                          <p className="text-xs sm:text-sm text-green-600">
                            Arquivo selecionado
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-center">
                          <div className="p-2 sm:p-3 bg-brand-100 rounded-lg sm:rounded-xl">
                            <FileSpreadsheet
                              size="24"
                              className="text-brand-600 sm:w-8 sm:h-8"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-brown-800 text-sm sm:text-base">
                            Clique para selecionar
                          </p>
                          <p className="text-xs sm:text-sm text-brown-600">
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
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    <FileX size="14" className="sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Download Template */}
            <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Download
                    size="16"
                    className="text-gray-600 flex-shrink-0 sm:w-[18px] sm:h-[18px]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      Modelo de Importação
                    </p>
                    <p className="text-xs text-gray-600 hidden sm:block">
                      Baixe o template Excel
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  className="px-2 py-1.5 sm:px-3 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex-shrink-0"
                >
                  Baixar
                </Button>
              </div>
            </div>

            {/* Process Preview */}
            {fileX && (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <Database
                    size="16"
                    className="text-brand-600 flex-shrink-0 sm:w-[18px] sm:h-[18px]"
                  />
                  <p className="text-xs sm:text-sm font-semibold text-brand-800">
                    Processo de Importação
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 sm:gap-2 text-brand-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-400 rounded-full"></div>
                    <span className="hidden xs:inline">Arquivo </span>Excel
                  </div>
                  <ArrowRight
                    size="14"
                    className="text-brand-500 sm:w-4 sm:h-4"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 text-brand-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-400 rounded-full"></div>
                    Validação
                  </div>
                  <ArrowRight
                    size="14"
                    className="text-brand-500 sm:w-4 sm:h-4"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 text-brand-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-400 rounded-full"></div>
                    Database
                  </div>
                </div>
              </div>
            )}

            {/* Warning if no file */}
            {!fileX && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle
                    size="16"
                    className="text-orange-600 mt-0.5 flex-shrink-0 sm:w-[18px] sm:h-[18px]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-orange-800">
                      Atenção
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Selecione um arquivo Excel para continuar com a
                      importação.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <X size="16" className="sm:w-[18px] sm:h-[18px]" />
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={loading || !fileX}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base ${
                  loading || !fileX
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : useProgressMode
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-green-500/25"
                    : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white hover:shadow-brand-500/25"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2
                      size="16"
                      className="animate-spin sm:w-[18px] sm:h-[18px]"
                    />
                    <span className="hidden sm:inline">
                      {useProgressMode
                        ? "Importando com progresso..."
                        : "Importando..."}
                    </span>
                    <span className="sm:hidden">
                      {useProgressMode ? "Progresso..." : "Importando..."}
                    </span>
                  </>
                ) : (
                  <>
                    {useProgressMode ? (
                      <BarChart3
                        size="16"
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    ) : (
                      <Upload size="16" className="sm:w-[18px] sm:h-[18px]" />
                    )}
                    <span className="hidden sm:inline">
                      {useProgressMode
                        ? "Importar com Progresso"
                        : "Importar Produtos"}
                    </span>
                    <span className="sm:hidden">
                      {useProgressMode ? "Com Progresso" : "Importar"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
