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
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-6 border border-brand-200 bg-white rounded-xl shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <div className="bg-gradient-to-r from-brand-50 to-brown-50 p-6 rounded-t-xl border-b border-brand-200">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-brown-800">
              {titleModal}
            </h2>
            {descriptionModal && (
              <p className="text-sm text-brown-600">{descriptionModal}</p>
            )}
            <p className="text-brown-700 font-medium">
              Tem certeza que deseja confirmar a venda?
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 px-6 pb-6">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6"
            onClick={closeModal}
          >
            Cancelar
          </Button>

          <Button
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 shadow-md"
            onClick={finish}
          >
            Confirmar Venda
          </Button>
        </div>
      </div>
    </Modal>
  );
};
