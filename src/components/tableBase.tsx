import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ".//ui/table";
import { TypeProduct } from "./types";

interface iCard {
  dataHeader: Array<keyof TypeProduct>;
  dataBody: TypeProduct[];
  setData: React.Dispatch<React.SetStateAction<TypeProduct[]>>;
  setSubTotal: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  subTotal: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  forma: string;
}

export const TableBase: React.FC<iCard> = ({
  dataHeader,
  dataBody,
  setData,
  setSubTotal,
  // total,
  setTotal,
  subTotal,
  // forma,
}) => {
  const handleDelete = (index: number) => {
    const productToDelete = dataBody[index];
    const newDataBody = dataBody.filter((_, i) => i !== index);
    const productPrice = parseFloat(
      String(productToDelete.preco).replace("R$", "").replace(",", ".")
    );
    const vTotal = Number(productToDelete.qtde) * Number(productPrice);
    const newPrice = subTotal - vTotal;
    const attPrice = parseFloat(newPrice.toFixed(2));
    setSubTotal(attPrice);
    setData(newDataBody);
    setTotal(attPrice);
  };
  const handleAdd = (index: number) => {
    const newBody = [...dataBody];
    const product = newBody[index];
    product.qtde += 1;
    const productPrice = parseFloat(
      String(product.preco).replace("R$", "").replace(",", ".")
    );
    const newSubTotal = subTotal + productPrice;
    const attSubTotal = parseFloat(newSubTotal.toFixed(2));
    setData(newBody);
    setSubTotal(attSubTotal);
    setTotal(attSubTotal);
  };

  const handleMinus = (index: number) => {
    const newBody = [...dataBody];
    const product = newBody[index];
    if (product.qtde <= 1) {
      return;
    }
    product.qtde -= 1;
    const productPrice = parseFloat(
      String(product.preco).replace("R$", "").replace(",", ".")
    );
    const newSubTotal = subTotal - productPrice;
    const attSubTotal = parseFloat(newSubTotal.toFixed(2));
    setData(newBody);
    setSubTotal(attSubTotal);
    setTotal(attSubTotal);
  };
  return (
    <>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            {dataHeader.map((header, index) => (
              <TableHead className="text-gray-200" key={index}>
                {header.toUpperCase()}
              </TableHead>
            ))}
            <TableHead>AÇÕES</TableHead>{" "}
            {/* Cabeçalho extra para a coluna de ações */}
          </TableRow>
        </TableHeader>
        <TableBody className="border-collapse">
          {dataBody.map((item, index) => (
            <TableRow key={index} className="text-left">
              {dataHeader.map((header, idx) => (
                <TableCell key={idx} className="border-b-[1px]">
                  {item[header]}{" "}
                </TableCell>
              ))}
              <TableCell className="border-b-[1px]">
                <div className="flex gap-3">
                  <button>
                    <Plus size={18} onClick={() => handleAdd(index)} />
                  </button>
                  <button className="text-red-600">
                    <Minus size={18} onClick={() => handleMinus(index)} />
                  </button>
                  <button
                    className="text-blue-700"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
