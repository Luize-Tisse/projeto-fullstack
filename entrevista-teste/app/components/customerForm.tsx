import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FormData = {
  nome: string;
  email: string;
  whatsapp?: string;
  tipo: string;
  cpf?: string;
  cnpj?: string;
};

const formSchema = z.object({
  nome: z.string().min(1, "Nome inválido"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().optional(),
  tipo: z.string(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
});

export default function CustomerForm({
  initialData,
  setIsEditing,
  getCustomers,
}: {
  initialData?: any;
  setIsEditing?: any;
  getCustomers?: () => {};
}) {
  const [type, setType] = useState(initialData ? initialData.tipo : "cpf");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: initialData || {
      tipo: "cpf",
      cpf: "",
      cpnj: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Ao enviar form
  async function onSubmit(data: FormData) {
    const totalData: any = {
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp,
      tipo: type,
    };

    if (type === "cpf") totalData.cpf = data.cpf;
    if (type === "cnpj") totalData.cnpj = data.cnpj;

    try {
      // Faz o POST ou PUT para a api
      await fetch(
        `http://localhost:8000/clientes/${initialData ? initialData.id : ""}`,
        {
          method: initialData ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(totalData),
        },
      );

      // Sair do modo edição
      if (setIsEditing) {
        setIsEditing(false);
      }

      // ReFetch dos customers
      if (getCustomers) {
        await getCustomers();
      }

      // Reseta o formulário
      reset({
        nome: "",
        email: "",
        whatsapp: "",
        tipo: "cpf",
        cpf: "",
        cnpj: "",
      });
      setType("cpf");
      setValue("tipo", "cpf");
      setValue("cpf", "");
      setValue("cnpj", "");
    } catch (error) {
      console.log(error);
    }
  }

  // Defini valor inicial do tipo no formulário
  useEffect(() => {
    setValue("tipo", type || "cpf");
  }, [type, setValue]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
    >
      <Field>
        <Label>Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nome"
          {...register("nome", { required: "Nome é obrigatório" })}
          aria-invalid={errors.nome !== undefined}
        />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
      </Field>

      <Field>
        <Label>E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register("email", { required: "Email é obrigatório" })}
          aria-invalid={errors.email !== undefined}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </Field>

      <Field>
        <Label>WhatsApp</Label>
        <Input
          id="phone"
          type="phone"
          placeholder="Telefone (com DDD)"
          {...register("whatsapp")}
          aria-invalid={errors.whatsapp !== undefined}
        />
        {errors.whatsapp && (
          <p className="text-red-500">{errors.whatsapp.message}</p>
        )}
      </Field>

      <div className="flex gap-2">
        <Field className="flex-1" aria-invalid={errors.tipo !== undefined}>
          <Label>Tipo</Label>
          <Select
            value={type || "cpf"}
            onValueChange={(newValue) => {
              setType(newValue);
              setValue("tipo", newValue);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="CPF/CNPJ" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <div className="w-2/3">
          {type === "cpf" ? (
            <Field>
              <Label>CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="111-222-333-44"
                {...register("cpf")}
                aria-invalid={errors.cpf !== undefined}
              />
              {errors.cpf && (
                <p className="text-red-500">{errors.cpf.message}</p>
              )}
            </Field>
          ) : (
            <Field>
              <Label>CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                placeholder="11.222.333/0000-44"
                {...register("cnpj")}
                aria-invalid={errors.cnpj !== undefined}
              />
              {errors.cnpj && (
                <p className="text-red-500">{errors.cnpj.message}</p>
              )}
            </Field>
          )}
        </div>
      </div>
      <Button type="submit">
        {initialData ? "Atualizar Cliente" : "Cadastrar Cliente"}
      </Button>
    </form>
  );
}
