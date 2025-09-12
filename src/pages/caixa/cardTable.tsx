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
    <Card className="bg-app-text-color border-app-text-color text-app-bg-color">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-app-bg-color overflow-x-auto">
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
