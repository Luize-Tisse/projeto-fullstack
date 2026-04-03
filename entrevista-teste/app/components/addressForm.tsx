import { useState } from "react";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";

type FormData = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
};

export default function AddressForm({
  initialData,
  setIsEditing,
  getAddresses,
}: {
  initialData?: any;
  setIsEditing?: any;
  getAddresses: () => {};
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData || {},
  });

  // Buscar endereço pelo CEP
  async function getAddressFromCEP(cep: string) {
    const response = await (
      await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    ).json();
    setValue("rua", response.logradouro);
    setValue("bairro", response.bairro);
    setValue("cidade", response.localidade);
  }

  // Ao enviar form
  async function onSubmit(data: FormData) {
    try {
      await fetch(
        `http://localhost:8000/enderecos/${initialData ? initialData.id : ""}`,
        {
          method: initialData ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      // Sair do modo de edição
      if (setIsEditing) {
        setIsEditing(false);
      }

      // ReFetch dos endereços
      await getAddresses();

      // Resetar formulário
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Label>CEP</Label>
        <Input
          id="cep"
          type="text"
          placeholder="CEP"
          {...register("cep", { required: "CEP é obrigatório" })}
          onBlur={(e) => getAddressFromCEP(e.target.value)}
        />
      </Field>

      <Field>
        <Label>Rua</Label>
        <Input
          id="rua"
          type="text"
          placeholder="Rua"
          {...register("rua", { required: "Rua é obrigatório" })}
        />
      </Field>

      <Field>
        <Label>Bairro</Label>
        <Input
          id="bairro"
          type="text"
          placeholder="Bairro"
          {...register("bairro", { required: "Bairro é obrigatório" })}
        />
      </Field>

      <Field>
        <Label>Cidade</Label>
        <Input
          id="cidade"
          type="text"
          placeholder="Cidade"
          {...register("cidade", { required: "Cidade é obrigatório" })}
        />
      </Field>
      <Button type="submit">
        {initialData ? "Atualizar Endereço" : "Adicionar Endereço"}
      </Button>
    </form>
  );
}
