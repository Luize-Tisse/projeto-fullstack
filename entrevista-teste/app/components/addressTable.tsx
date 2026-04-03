import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import AddressDetails from "./addressDetails";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function AddressTable({
  addresses,
  getAddresses,
}: {
  addresses: any[];
  getAddresses: () => {};
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>CEP</TableHead>
          <TableHead>Rua</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address) => (
          <Dialog>
            <DialogTrigger asChild>
              <TableRow key={address.id} className="hover:cursor-pointer">
                <TableCell>{address.cep || "-"}</TableCell>
                <TableCell>{address.rua || "-"}</TableCell>
                <TableCell>{address.bairro || "-"}</TableCell>
                <TableCell>{address.cidade || "-"}</TableCell>
                <TableCell>{address.createdAt.split("T")[0] || "-"}</TableCell>
              </TableRow>
            </DialogTrigger>
            <DialogContent>
              <AddressDetails
                addressId={address.id}
                getAddresses={getAddresses}
              />
            </DialogContent>
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );
}
