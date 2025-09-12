import { Label } from "@radix-ui/react-label";
import { Modal } from "../../components/modalBase";
import { Button } from "../../components/ui/button";
import { MapPin, Phone, User } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState } from "react";

interface iModalVenda {
  isOpen: boolean;
  closeModal: () => void;
  titleModal: string;
  descriptionModal: string;
  finish: () => void;
}

export const ModalVendaCard: React.FC<iModalVenda> = ({
  isOpen,
  closeModal,
  titleModal,
  descriptionModal,
  finish,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    numeroCartao: "",
    nomeTitular: "",
    expiraMes: "",
    expiraAno: "",
    cvv: "",
    parcelas: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Aqui você pode enviar os dados para a API ou processá-los como preferir.
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <div
        className="relative left-[50%] top-[50%] z-50 grid w-full max-w- translate-x-[-50%] 
      translate-y-[0%] gap-4 border border-slate-200 bg-white p-6 shadow-lg sm:rounded-lg 
      dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="">
          <div className="text-lg font-semibold leading-none tracking-tight">
            <span>{titleModal}</span>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {descriptionModal}
            </div>
          </div>
          <div>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Formulário de Compra
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Dados Pessoais */}
                <div className="mb-4">
                  <Label htmlFor="nome" className="flex items-center space-x-2">
                    <User size={20} />
                    <span>Nome</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2"
                  >
                    <User size={20} />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Seu e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="cpf" className="flex items-center space-x-2">
                    <User size={20} />
                    <span>CPF</span>
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="Seu CPF"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label
                    htmlFor="telefone"
                    className="flex items-center space-x-2"
                  >
                    <Phone size={20} />
                    <span>Telefone</span>
                  </Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="text"
                    placeholder="Seu telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                {/* Endereço */}
                <div className="mb-4">
                  <Label
                    htmlFor="endereco"
                    className="flex items-center space-x-2"
                  >
                    <MapPin size={20} />
                    <span>Endereço</span>
                  </Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    type="text"
                    placeholder="Endereço de cobrança"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4 flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      type="text"
                      value={formData.cidade}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      type="text"
                      value={formData.estado}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    type="text"
                    value={formData.cep}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                {/* Dados do Cartão */}
                <div className="mb-4">
                  <Label htmlFor="numeroCartao">Número do Cartão</Label>
                  <Input
                    id="numeroCartao"
                    name="numeroCartao"
                    type="text"
                    value={formData.numeroCartao}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="nomeTitular">Nome do Titular</Label>
                  <Input
                    id="nomeTitular"
                    name="nomeTitular"
                    type="text"
                    value={formData.nomeTitular}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="mb-4 flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="expiraMes">Mês de Expiração</Label>
                    <Input
                      id="expiraMes"
                      name="expiraMes"
                      type="text"
                      value={formData.expiraMes}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="expiraAno">Ano de Expiração</Label>
                    <Input
                      id="expiraAno"
                      name="expiraAno"
                      type="text"
                      value={formData.expiraAno}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                {/* Parcelamento */}
                <div className="mb-4">
                  <Label htmlFor="parcelas">Parcelamento</Label>
                  <Select
                    id="parcelas"
                    name="parcelas"
                    value={formData.parcelas.toString()}
                    onValueChange={handleSelectChange}
                    className="mt-2"
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Escolha o parcelamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12).keys()].map((i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                          {i + 1}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão de Submissão */}
                <Button
                  type="submit"
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  Finalizar Compra
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse gap-1">
          <Button
            className="h-7 bg-red-600 hover:bg-red-600"
            onClick={closeModal}
          >
            Cancelar
          </Button>

          <Button
            className="h-7 bg-green-600 hover:bg-green-600"
            onClick={finish}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
