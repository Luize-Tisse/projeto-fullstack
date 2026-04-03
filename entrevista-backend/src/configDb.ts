import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cliente } from "./entities/cliente.js";
import { Endereco } from "./entities/endereco.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "entrevista",
  synchronize: true, // criar tabelas automaticamente
  logging: false,
  entities: [Cliente, Endereco],
});
