import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from "../../components/ui/textarea";

const ModalComponent = (item) => {
  const unidademedidas = [
    { id: "Unit", nome: "Unidades" },
    { id: "KM", nome: "Quilometragem" },
    { id: "KG", nome: "Kilogramas" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Plus className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="border-green-500">
        <DialogHeader>
          <DialogTitle>Adicionando item</DialogTitle>
          <DialogDescription>
            Inclua licitações que são pertinentes para o planejamento anual, é
            importante ser o mais assertivo possível.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="col-span-2">
            <Label>Item</Label>
            <Input placeholder="Ex: Macarrão..." className="mt-1" />
          </div>

          <div className="col-span-1">
            <Label>Qtde.</Label>
            <Input className="mt-1" placeholder="Estimada" type="number" />
          </div>

          <div className="col-span-3">
            <Label>Unidade de medida</Label>
            <div className="mt-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade de medida." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Opções</SelectLabel>
                    {unidademedidas.map((mod) => (
                      <SelectItem value={mod.id}>{mod.nome}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="col-span-3">
            <Label>Descrição</Label>
            <Textarea placeholder="Descreva o item..." className="mt-1" />
          </div>
        </div>
        <DialogFooter className="flex text-center items-center mt-4">
          <Button
            className="bg-red-600 rounded-lg hover:bg-red-600 h-7"
            asChild
          >
            Fechar
          </Button>

          <Button className="bg-green-600 rounded-lg hover:bg-green-600 h-7">
            Incluir Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
