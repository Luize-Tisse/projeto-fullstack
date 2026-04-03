import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./cliente.js";

@Entity("enderecos")
export class Endereco {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cep!: string;

  @Column()
  rua!: string;

  @Column()
  bairro!: string;

  @Column()
  cidade!: string;

  @ManyToMany(() => Cliente, (cliente) => cliente.enderecos)
  clientes?: Cliente[];

  @CreateDateColumn()
  createdAt!: Date;
}
