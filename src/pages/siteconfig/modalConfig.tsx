import { Label } from "@radix-ui/react-label";
import { Modal } from "../../components/modalBase";
import { Input } from "../../components/ui/input";
import { useData } from "../../components/context";

interface iModalSiteConfig {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
}

type ConfigSiteType = {
  body: string;
  header: string;
  footer: string;
};

export const ModalConfigSite: React.FC<iModalSiteConfig> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
}) => {
  const { setConfigSite, isConfigSite } = useData() as {
    setConfigSite: (data: ConfigSiteType) => ConfigSiteType;
    isConfigSite: ConfigSiteType;
  };

  const handleBodyConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setConfigSite({
      ...isConfigSite,
      body: newColor,
    });
  };

  const handleHeaderConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setConfigSite({
      ...isConfigSite,
      header: newColor,
    });
  };

  const handleFooterPgtoConfig = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = event.target.value;
    setConfigSite({
      ...isConfigSite,
      footer: newColor,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      // overlayClassName="fixed inset-0 z-50 bg-black/80"
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-4">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {titleModal}
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Body</Label>
              <Input
                type="color"
                defaultValue={isConfigSite.body}
                onChange={handleBodyConfig}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Header</Label>
              <Input
                type="color"
                defaultValue={isConfigSite.header}
                onChange={handleHeaderConfig}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Footer Pagamentos</Label>
              <Input
                type="color"
                defaultValue={isConfigSite.footer}
                onChange={handleFooterPgtoConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
