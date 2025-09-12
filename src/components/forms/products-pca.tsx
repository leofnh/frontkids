import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

export function ProductDate() {
  const { register, handleSubmit } = useForm();
  function handleFilterProduct(data: any) {
    console.log(data);
  }
  return (
    <form
      onSubmit={handleSubmit(handleFilterProduct)}
      className="grid grid-cols-1"
    >
      <div className="col-span-1 mt-2">
        <Label>Data para conclusão</Label>
        <Input type="date" className="mt-1 w-auto" {...register("id")} />
      </div>

      <DialogFooter className="flex text-center items-center">
        <Button className="bg-red-600 rounded-lg hover:bg-red-600 h-7">
          Fechar
        </Button>

        <Button
          type="submit"
          className="bg-green-600 rounded-lg hover:bg-green-600 h-7"
        >
          Criar PCA
        </Button>
      </DialogFooter>
    </form>
  );
}
