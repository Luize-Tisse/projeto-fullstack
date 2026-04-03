import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import CustomerForm from "./customerForm";

export default function CustomerDetails({
  customerId,
  getCustomers,
}: {
  customerId: number;
  getCustomers: () => {};
}) {
  const [customer, setCustomer] = useState(null as any);
  const [addresses, setAddresses] = useState([] as any[]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Busca o cliente
  async function getCustomer() {
    const response = await fetch(
      `http://localhost:8000/clientes/${customerId}`,
    );
    const data = await response.json();

    setCustomer(data || {});
  }

  // Busca os endereços
  async function getAddresses() {
    const data = await fetch("http://localhost:8000/enderecos");

    setAddresses(await data.json());
  }

  // Excluir cliente
  async function deleteCustomer() {
    await fetch(`http://localhost:8000/clientes/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsEditing(false);
    await getCustomers();
  }

  // Vincular cliente a endereço
  async function vincularCustomer() {
    if (!selectedAddressId) return;

    const response = await fetch("http://localhost:8000/vincular-endereco", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clienteId: customerId,
        enderecoId: parseInt(selectedAddressId),
      }),
    });

    if (!response.ok) {
      console.error("Falha ao vincular endereço", await response.text());
      alert("Não foi possível vincular o endereço. Tente novamente.");
      return;
    }

    setSelectedAddressId("");
    await getCustomer();
  }

  // Buscar cliente
  useEffect(() => {
    getCustomer();
  }, [isEditing]);

  // Buscar endereços
  useEffect(() => {
    getAddresses();
  }, []);

  if (!customer) {
    return;
  }

  if (!isEditing) {
    return (
      <Card className="m-4 max-w-3xl min-h-[320px] p-6">
        <CardHeader>
          <CardTitle>{customer.nome}</CardTitle>
          <CardDescription>
            {customer.email} - {customer.whatsapp}
          </CardDescription>
          <CardDescription>
            {customer.tipo}:{" "}
            {customer.tipo === "cpf" ? customer.cpf : customer.cnpj}
          </CardDescription>
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1"
              variant="destructive"
              onClick={deleteCustomer}
            >
              Excluir Cliente
            </Button>
            <Button className="flex-1" onClick={() => setIsEditing(true)}>
              Editar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 mt-4">
          <Label>Endereços Vinculados</Label>
          <div className="flex flex-col gap-2">
            {customer.enderecos &&
              customer.enderecos.length > 0 &&
              customer.enderecos.map((endereco: any) => (
                <Card key={endereco.id}>
                  <CardContent>
                    {endereco.rua}, {endereco.bairro}, {endereco.cidade} -{" "}
                    {endereco.cep}
                  </CardContent>
                </Card>
              ))}
          </div>
          {/* Selecionar e vincular novo endereço */}
          <div className="flex gap-2">
            <Select
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um endereço" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {addresses.map((address) => (
                    <SelectItem
                      value={address.id.toString()}
                      key={address.id.toString()}
                    >{`${address.rua}, ${address.bairro}, ${address.cidade} - ${address.cep}`}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={vincularCustomer} disabled={!selectedAddressId}>
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="m-4 max-w-3xl min-h-[320px] p-6">
        <CardContent>
          <Button
            className="mb-4"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Voltar
          </Button>
          <CustomerForm initialData={customer} setIsEditing={setIsEditing} />
        </CardContent>
      </Card>
    );
  }
}
