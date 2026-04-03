import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import CustomerDetails from "./customerDetails";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function CustomerTable({
  getCustomers,
  customers,
}: {
  getCustomers: () => {};
  customers: any[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>CPF/CNPJ</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <Dialog
            onOpenChange={() => {
              getCustomers();
            }}
            key={customer.id}
          >
            <DialogTrigger asChild>
              <TableRow key={customer.id} className="hover:cursor-pointer">
                <TableCell>{customer.nome || "-"}</TableCell>
                <TableCell>{customer.email || "-"}</TableCell>
                <TableCell>{customer.whatsapp || "-"}</TableCell>
                <TableCell>{customer.tipo || "-"}</TableCell>
                <TableCell>
                  {(customer.tipo === "cpf" ? customer.cpf : customer.cnpj) ||
                    "-"}
                </TableCell>
                <TableCell>{customer.createdAt.split("T")[0] || "-"}</TableCell>
              </TableRow>
            </DialogTrigger>
            <DialogContent>
              <CustomerDetails
                customerId={customer.id}
                getCustomers={getCustomers}
              />
            </DialogContent>
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );
}
