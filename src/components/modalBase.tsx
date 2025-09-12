import ReactModal, { Props as ModalProps } from "react-modal";

//import styles from "./styles.module.scss";

ReactModal.setAppElement("#root");

export function Modal({ children, ...rest }: ModalProps) {
  return (
    <ReactModal
      className="gap-4 max-w-full max-h-full overflow-y-auto sm:max-w-lg sm:rounded-lg p-6"
      //className="max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto sm:rounded-lg bg-white p-6"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      {...rest}
    >
      <div className="max-h-[80vh] overflow-y-auto">{children}</div>
    </ReactModal>
  );
}
