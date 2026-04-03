import AddressForm from "~/components/addressForm";
import CustomerForm from "~/components/customerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Route } from "./+types/home";
import CustomerTable from "~/components/customerTable";
import AddressTable from "~/components/addressTable";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  async function getCustomers() {
    const customers = await fetch(
      `http://localhost:8000/clientes?search=${search}&date=${selectedDate}`,
    );

    setCustomers(await customers.json());
  }

  async function getAddresses() {
    const data = await fetch("http://localhost:8000/enderecos");

    setAddresses(await data.json());
  }

  useEffect(() => {
    getCustomers();
    getAddresses();
  }, [search, selectedDate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <Tabs defaultValue="pessoa">
        <TabsList>
          <TabsTrigger value="pessoa">Cadastro de Pessoa</TabsTrigger>
          <TabsTrigger value="endereco">Cadastro de Endereço</TabsTrigger>
        </TabsList>

        <TabsContent value="pessoa" className="flex flex-col gap-2">
          <CustomerForm getCustomers={getCustomers} />
          <h1 className="text-2xl mt-8 font-bold ">Clientes</h1>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquise por nome ou email"
            />
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <CustomerTable customers={customers} getCustomers={getCustomers} />
        </TabsContent>
        <TabsContent value="endereco" className="flex flex-col gap-2">
          <AddressForm getAddresses={getAddresses} />
          <h1 className="text-2xl mt-8 font-bold ">Endereços</h1>
          <AddressTable addresses={addresses} getAddresses={getAddresses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
