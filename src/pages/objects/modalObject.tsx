import { Button } from "../../components/ui/button";
import { useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function modalObject(id_pca: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalidades = [
    { id: "pe", nome: "Pregão Eletrônico" },
    { id: "de", nome: "Dispensa Eletrônica" },
    { id: "cd", nome: "Credenciamento" },
  ];

  const closeModal = () => setIsModalOpen(!isModalOpen);
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-app-green hover:bg-app-green rounded-lg p-4 h-7">
            Criar objeto
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciando PCA</DialogTitle>
            <DialogDescription>
              <span>
                Inclua licitações que são pertinentes para o planejamento anual,
                é importante ser o mais assertivo possível.
              </span>
            </DialogDescription>
            <div className="grid grid-cols-2 mt-4 gap-8">
              <div>
                <Label>Objeto</Label>
                <Input placeholder="Ex: Merenda Escolar..." className="mt-1" />
              </div>

              <div>
                <Label>Modalidade</Label>
                <div className="mt-1 w-full">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Modalidades</SelectLabel>
                        {modalidades.map((mod) => (
                          <SelectItem value={mod.id}>{mod.nome}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Data Estimada</Label>
                <Input className="mt-1 w-auto" type="date" />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex text-center items-center mt-4">
            <Button
              className="bg-red-600 rounded-lg hover:bg-red-600 h-7"
              onClick={closeModal}
            >
              Fechar
            </Button>

            <Button className="bg-green-600 rounded-lg hover:bg-green-600 h-7">
              Criar Objeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
