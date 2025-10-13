import { useData } from "../../components/context";
import { Modal } from "../../components/modalBase";
import { TypeCurrent } from "../../components/types";
import { Button } from "../../components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  X,
  CreditCard,
  FileText,
  Clock,
} from "lucide-react";

interface iModalVendaNota {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  finish: (data: TypeCurrent) => void;
  data: TypeCurrent;
}

export const ModalConfirmVendaNota: React.FC<iModalVendaNota> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  finish,
  data,
}) => {
  const { formatedMoney } = useData() as {
    formatedMoney: (value: number) => number;
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md max-h-[90vh] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl border border-orange-200 shadow-2xl shadow-orange-900/10 overflow-hidden flex flex-col max-h-full">
            {/* Header with Warning Theme */}
            <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-orange-200 flex-shrink-0">
              <button
                onClick={closeModal}
                className="absolute right-3 sm:right-4 top-3 sm:top-4 p-2 rounded-full bg-white/80 hover:bg-white border border-orange-200 text-orange-600 hover:text-orange-800 transition-all duration-200 hover:scale-105"
              >
                <X size="18" />
              </button>

              <div className="flex items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
                <div className="relative">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                    <AlertTriangle size="20" className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brown-800">
                    {titleModal}
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    {descriptionModal}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isOpen && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Warning Message */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size="18"
                        className="text-orange-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">
                          Confirmação de Pagamento
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                          Esta ação irá marcar a notinha como paga e não poderá
                          ser desfeita.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <FileText size="16" className="text-brand-600" />
                      <h3 className="font-semibold text-brown-800 text-sm sm:text-base">
                        Detalhes da Notinha
                      </h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {/* Cliente */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <User size="14" className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Cliente
                          </p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {data.cliente}
                          </p>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <DollarSign size="14" className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Valor
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatedMoney(data.valor)}
                          </p>
                        </div>
                        <div className="p-2 bg-brand-100 rounded-lg">
                          <CreditCard size="14" className="text-brand-600" />
                        </div>
                      </div>

                      {/* Vencimento */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                          <Calendar size="14" className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Vencimento
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(data.vencimento).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size="12" className="text-orange-500" />
                          <span className="text-xs text-orange-600 font-medium">
                            {new Date(data.vencimento) < new Date()
                              ? "Vencida"
                              : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Message Preview */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size="18"
                        className="text-green-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Após confirmação
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          A notinha será marcada como paga e removida da lista
                          de pendências.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions - Fixed at bottom */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <X size="16" />
                  Cancelar
                </Button>

                <Button
                  onClick={() => {
                    closeModal();
                    finish(data);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-green-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CheckCircle2 size="16" />
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
