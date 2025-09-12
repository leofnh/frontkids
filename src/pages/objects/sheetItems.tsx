import { Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

export function sheetListItems(objeto, item) {
  const itensObjeto = item.filter((item_obj) => item_obj.objeto === objeto.pk);
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Eye className="cursor-pointer text-green-800" />
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle>Visualizar Quantitativos</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          {itensObjeto.map((dado, index) => (
            <div className="grid grid-cols-2 gap-2 text-xs border-b-2 border-black overflow-auto-x mb-2  pb-3">
              <div className="col-span-1">
                <span className="font-bold">Item</span>
                <p>{dado.nome}</p>
              </div>
              <div className="col-span-1">
                <span className="font-bold">Valor</span>
                <p>{dado.valor}</p>
              </div>
              <div className="col-span-1">
                <span className="font-bold">Unidade de medida</span>
                <p>{dado.tipo}</p>
              </div>
              <div className="col-span-1">
                <span className="font-bold">Qtde.</span>
                <p>{dado.qtde}</p>
              </div>
              <div className="col-span-1">
                <span className="font-bold">Descrição</span>
                <p>{dado.descricao}</p>
              </div>

              <div className="col-span-1">
                <span className="font-bold">Valor Estimado</span>
                <p>{dado.valor_estimado}</p>
              </div>
            </div>
          ))}

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
