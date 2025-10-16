import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { TableBase } from "../../components/tableBase";
import { TypeProduct } from "../../components/types";

interface iCard {
  title: string;
  description: string;
  setData: React.Dispatch<React.SetStateAction<TypeProduct[]>>;
  setSubtotal: React.Dispatch<React.SetStateAction<number>>;
  subTotal: number;
  total: number;
  dataBody: TypeProduct[];
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  forma: string;
}

export const CardTable: React.FC<iCard> = ({
  title,
  description,
  setData,
  setSubtotal,
  total,
  subTotal,
  dataBody,
  setTotal,
  forma,
}) => {
  const dataHeader: Array<keyof TypeProduct> = [
    "produto",
    "marca",
    "tamanho",
    "codigo",
    "ref",
    "preco",
    "qtde",
  ];

  return (
    <Card className="bg-white border-brand-200 shadow-sm text-center">
      <CardHeader className="bg-gradient-to-r from-brand-50 to-brown-50 border-b border-brand-200">
        <CardTitle className="text-xl font-semibold text-brown-800">
          {title}
        </CardTitle>
        <CardDescription className="text-brown-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 overflow-x-auto">
        <TableBase
          dataHeader={dataHeader}
          dataBody={dataBody}
          setData={setData}
          setSubTotal={setSubtotal}
          subTotal={subTotal}
          total={total}
          setTotal={setTotal}
          forma={forma}
        />
      </CardContent>
    </Card>
  );
};
