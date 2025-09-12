import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";

interface iModalVenda {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  finish: () => void;
}

export const ModalConfirmVenda: React.FC<iModalVenda> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  finish,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-1">
          <div className="text-lg font-semibold leading-none tracking-tight">
            <span>{titleModal}</span>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>Tem certeza que deseja confirmar a venda?</div>
        </div>
        <div className="flex flex-row-reverse gap-1">
          <Button
            className="h-7 bg-red-600 hover:bg-red-600"
            onClick={closeModal}
          >
            Cancelar
          </Button>

          <Button
            className="h-7 bg-green-600 hover:bg-green-600"
            onClick={finish}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
