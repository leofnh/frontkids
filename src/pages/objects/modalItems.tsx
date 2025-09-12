import { useState } from "react";
import { Button } from "../../components/ui/button";
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
import { Textarea } from "../../components/ui/textarea";
import { Plus } from "lucide-react";

export function ModalItem() {
  const [isOpen, setIsOpen] = useState(false);

  const unidademedidas = [
    { id: "Unit", nome: "Unidades" },
    { id: "KM", nome: "Quilometragem" },
    { id: "KG", nome: "Kilogramas" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Plus className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="overflow-x-auto">
          <DialogHeader>
            <DialogTitle>Adicionando item</DialogTitle>
            <DialogDescription>
              <span>
                Inclua licitações que são pertinentes para o planejamento anual,
                é importante ser o mais assertivo possível.
              </span>
            </DialogDescription>
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div>
                <Label>Item</Label>
                <Input placeholder="Ex: Macarrão..." className="mt-1" />
              </div>

              <div>
                <Label>Unidade de medida</Label>
                <div className="mt-1 w-full">
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

              <div>
                <Label>Quantidade estimada</Label>
                <Input
                  className="mt-1"
                  placeholder="Quantidade prevista..."
                  type="number"
                />
              </div>
            </div>
            <div className="mt-3">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descreva o item..."
                className="mt-1 max-h-40"
              />
            </div>
          </DialogHeader>
          <DialogFooter className="flex text-center items-center mt-4">
            <Button
              className="bg-red-600 rounded-lg hover:bg-red-600 h-7"
              onClick={() => setIsOpen(!isOpen)}
            >
              Fechar
            </Button>
            <Button className="bg-green-600 rounded-lg hover:bg-green-600 h-7">
              Incluir Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
