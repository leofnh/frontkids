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

export function SheetPedido(pedido) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-transparent hover:bg-transparent underline solid font-bold text-[#7B6648]">
            Detalhes da compra
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle className="bg-[#787878] text-white font-bold text-center">
              Detalhes da compra
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-4 text-xs overflow-auto-x mb-2 pb-3">
            <div className="col-span-1">
              <span className="font-bold">Produto</span>
              <p>{pedido.produto}</p>
            </div>
            <div className="col-span-1">
              <span className="font-bold">Valor</span>
              <p>{pedido.preco}</p>
            </div>
            <div className="col-span-1">
              <span className="font-bold">Código do produto</span>
              <p>{pedido.codigo}</p>
            </div>
            <div className="col-span-1">
              <span className="font-bold">Qtde.</span>
              <p>{pedido.quantidade}</p>
            </div>
            <div className="col-span-1">
              <span className="font-bold">Marca</span>
              <p>{pedido.marca}</p>
            </div>

            <div className="col-span-1">
              <span className="font-bold">Endereço para entrega</span>
              <p>{`${pedido.endereco}, ${pedido.cidade}, ${pedido.estado}`}</p>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
