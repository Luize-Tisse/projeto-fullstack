import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Endereco } from "./endereco.js";

@Entity("cliente")
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column()
  tipo!: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @ManyToMany(() => Endereco, (endereco) => endereco.clientes)
  @JoinTable()
  enderecos!: Endereco[];

  @CreateDateColumn()
  createdAt!: Date;
}
