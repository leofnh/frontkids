import { Modal } from "../../components/modalBase";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ProdutoCondicional } from "../../components/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface iAddProdutoCondicional {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  produtos: ProdutoCondicional[];
  idCondicional: number | null;
  setProdutosCondicionais: (data: ProdutoCondicional[]) => void;
}

export const AddProdutoCondicional: React.FC<iAddProdutoCondicional> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  idCondicional,
}) => {
  //const [isProdutos, setProdutos] = useState<ProdutoCondicional[]>(produtos);
  const [codigo, setCodigo] = useState("");
  const [produtosCond, setProdutoCond] = useState<ProdutoCondicional[]>([]);
  const dataHeader: Array<keyof ProdutoCondicional> = [
    "nome",
    "produto",
    "preco",
  ];
  const sendProdutoCond = async () => {
    try {
      const data = new FormData();
      data.append("codigo", codigo);
      data.append("condicional", String(idCondicional));
      const response = await api.post("api/add/produto-condicional/", data);
      const status = response.data.status;
      const msg = response.data.msg;
      if (status == "sucesso") {
        const dados = response.data.dados_produtos;
        setProdutoCond(dados);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getProdutos = async () => {
      const response = await api.get("api/adm/condicional/");
      const status = response.data.status;
      if (status == "sucesso") {
        const dados = response.data.dados_produtos;
        setProdutoCond(dados);
      }
    };
    getProdutos();
  }, [setProdutoCond]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      // overlayClassName="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    >
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-white p-6 shadow-lg sm:rounded-lg overflow-y-auto max-h-[90vh] dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left gap-4">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {titleModal}
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <div
              //  onSubmit={handleSubmit(handleFilterProduct)}
              //onSubmit={() => sendProdutoCond()}
              className="grid grid-cols-1 mb-4"
            >
              <div className="grid grid-cols-2 mt-4 gap-8">
                <div className="col-span-2 flex gap-4 items-center">
                  <Label>Código</Label>
                  <Input
                    placeholder="Código de barras"
                    className="mt-1"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                  <Button
                    className="h-8 bg-green-600 hover:bg-green-700"
                    onClick={() => sendProdutoCond()}
                  >
                    Cadastrar
                  </Button>
                </div>
              </div>
            </div>
            <div>
              {produtosCond?.filter((fil) => fil.condicional == idCondicional)
                .length > 0 && (
                <Table className="bg-transparent">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {dataHeader.map((header, index) => (
                        <TableHead
                          className="text-center font-bold hover:bg-transparent"
                          key={index}
                        >
                          {header.toUpperCase()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-collapse hover:bg-transparent text-black">
                    {produtosCond
                      ?.filter((fi) => fi.condicional == idCondicional)
                      .map((item, index) => (
                        <TableRow
                          key={index}
                          className="text-center hover:bg-transparent"
                        >
                          {dataHeader.map((header, idx) => (
                            <TableCell
                              key={idx}
                              className="border-b-[1px] hover:bg-transparent"
                            >
                              {item[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* <div className="mt-4 flex">
              <div className="ml-auto">
                <Button className="h-8">Ok</Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};
