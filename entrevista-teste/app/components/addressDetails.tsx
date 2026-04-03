import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import AddressForm from "./addressForm";

export default function AddressDetails({
  addressId,
  getAddresses,
}: {
  addressId: number;
  getAddresses: () => {};
}) {
  const [address, setAddress] = useState({} as any);
  const [isEditing, setIsEditing] = useState(false);

  // Busca os endereços
  async function getAddress() {
    const response = await fetch(
      `http://localhost:8000/enderecos/${addressId}`,
    );

    setAddress(await response.json());
  }

  // Excluir endereço
  async function deleteAddress() {
    await fetch(`http://localhost:8000/enderecos/${addressId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsEditing(false);
    await getAddresses();
  }

  // Chama a busca de endereços quando trocar modo de edição
  useEffect(() => {
    getAddress();
  }, [isEditing]);

  if (!address) return null;

  if (!isEditing) {
    return (
      <Card className="m-4 max-w-3xl p-6">
        <CardContent className="flex flex-col gap-4">
          {address.cep} - {address.rua}, {address.bairro}, {address.cidade}
          <div className="flex w-full gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                deleteAddress();
              }}
            >
              Excluir Endereço
            </Button>
            <Button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Editar Endereço
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="m-4 max-w-3xl p-6">
        <CardContent>
          <AddressForm
            initialData={address}
            setIsEditing={setIsEditing}
            getAddresses={getAddresses}
          />
        </CardContent>
      </Card>
    );
  }
}
