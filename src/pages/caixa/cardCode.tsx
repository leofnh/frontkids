import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { api } from "../../services/api";
import {
  CondicionalType,
  ProductGroup,
  ProdutoCondicional,
  TypeCarrinho,
} from "../../components/types";

interface iCard {
  title: string;
  description: string;
  dataProduct: ProductGroup[];
  handleData: React.Dispatch<React.SetStateAction<TypeCarrinho[]>>;
  dataUpdate: TypeCarrinho[];
  notifyError: (text: string) => void;
  setSubtotal: React.Dispatch<React.SetStateAction<number>>;
  troco: number;
  setTroco: React.Dispatch<React.SetStateAction<number>>;
  forma: string;
  subTotal: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

export const CardSearchCode: React.FC<iCard> = ({
  title,
  description,
  dataProduct,
  handleData,
  dataUpdate,
  notifyError,
  setSubtotal,
  troco,
  setTroco,
  forma,
  subTotal,
  setTotal,
}) => {
  const [code, setCode] = useState("");
  const [tipo, setTipo] = useState<"produto" | "condicional">("produto");
  const [condicionais, setCondicional] = useState<CondicionalType[]>([]);
  const [produtosCondicionais, setProdutosCondicionais] = useState<
    ProdutoCondicional[]
  >([]);
  const handleDataBody = () => {
    //const pk = parseInt(code);
    const itensObjeto = dataProduct.filter(
      (item_obj) => item_obj.codigo === code
    );
    const itensObjetoUpdate = dataUpdate.filter(
      (item_obj) => item_obj.codigo === code
    );

    if (itensObjeto.length > 0) {
      const item = itensObjeto[0];
      const itemValue = String(item.preco);
      const formatedValue = parseFloat(
        itemValue.replace("R$", "").replace(",", ".")
      );

      const formattedData = {
        id: item.id,
        produto: item.produto,
        marca: item.marca,
        tamanho: item.tamanho,
        ref: item.ref,
        qtde: 1,
        preco: item.preco,
        codigo: item.codigo,
      };
      if (itensObjetoUpdate.length > 0) {
        notifyError(
          "Este item já foi adicionado ao caixa. Você pode editar ele dentro do caixa ou remover."
        );
      } else {
        handleData((prevDataBody) => [...prevDataBody, formattedData]);
        setSubtotal((prevSub) => prevSub + formatedValue);
        setTotal((prevTotal) => prevTotal + formatedValue);

        if (forma == "dinheiro" || forma == "pix" || forma == "debito") {
          const newValue = subTotal + formatedValue;
          const newTroco = newValue - troco;
          setTroco(newTroco);
        }
      }
    } else {
      notifyError("Ops! Não encontramos no banco de dados o código digitado.");
    }
    //handleData(itensObjeto);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleCpf = () => {
    const filter = produtosCondicionais?.filter((it) => it.cpf == code);
    filter.forEach((it) => {
      const itensObjeto = dataProduct.filter(
        (item_obj) => item_obj.codigo === it.produto
      );
      if (itensObjeto.length > 0) {
        const itensObjetoUpdate = dataUpdate.filter(
          (item_obj) => item_obj.codigo === it.produto
        );
        const item = itensObjeto[0];
        const itemValue = String(item.preco);
        const formatedValue = parseFloat(
          itemValue.replace("R$", "").replace(",", ".")
        );

        const formattedData = {
          id: item.id,
          produto: item.produto,
          marca: item.marca,
          tamanho: item.tamanho,
          ref: item.ref,
          qtde: 1,
          preco: item.preco,
          codigo: item.codigo,
        };

        if (itensObjetoUpdate.length > 0) {
          notifyError(
            "Este item já foi adicionado ao caixa. Você pode editar ele dentro do caixa ou remover."
          );
        } else {
          handleData((prevDataBody) => [...prevDataBody, formattedData]);
          setSubtotal((prevSub) => prevSub + formatedValue);
          setTotal((prevTotal) => prevTotal + formatedValue);

          if (forma == "dinheiro" || forma == "pix" || forma == "debito") {
            const newValue = subTotal + formatedValue;
            const newTroco = newValue - troco;
            setTroco(newTroco);
          }
        }
      } else {
        notifyError(
          "Ops! Não encontramos no banco de dados o código digitado."
        );
      }
    });
  };

  useEffect(() => {
    const getProdutos = async () => {
      const response = await api.get("api/adm/condicional/");
      const status = response.data.status;
      if (status == "sucesso") {
        const dados = response.data.dados;
        const produtos = response.data.dados_produtos;
        setCondicional(dados);
        setProdutosCondicionais(produtos);
      }
    };
    getProdutos();
  }, [setCondicional]);

  return (
    <Card className="bg-app-text-color border-app-text-color text-app-bg-color">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-200">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-app-bg-color">
        <div className="flex flex-col items-center gap-4 mb-6">
          <span className="font-medium">Selecione o tipo:</span>
          <RadioGroup
            value={tipo}
            onValueChange={(value: "produto" | "condicional") => setTipo(value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="produto" id="produto" />
              <Label htmlFor="produto">Produto</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="condicional" id="condicional" />
              <Label htmlFor="condicional">Condicional</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="search-code">Código</Label>
          <Input
            id="search-code"
            list={tipo === "condicional" ? "condicionais" : undefined}
            placeholder={
              tipo === "produto"
                ? "Pesquise pelo código de barras..."
                : "Pesquise pelo CPF..."
            }
            className="mt-1"
            onChange={handleInputChange}
          />

          {tipo === "condicional" && (
            <datalist id="condicionais">
              {condicionais.map((c) => (
                <option key={c.id} value={c.cliente}>
                  {c.nome}
                </option>
              ))}
            </datalist>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row-reverse">
        <Button
          onClick={() => {
            if (tipo === "produto") {
              handleDataBody();
            } else {
              handleCpf();
            }
          }}
          className="bg-app-bg-color text-app-text-color hover:bg-app-bg-color/90"
        >
          Buscar
        </Button>
      </CardFooter>
    </Card>
  );
};
