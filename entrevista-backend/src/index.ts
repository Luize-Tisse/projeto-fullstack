import express from "express";
import cors from "cors";
import { AppDataSource } from "./configDb.js";
import { Cliente } from "./entities/cliente.js";
import { Endereco } from "./entities/endereco.js";
import { Between, ILike } from "typeorm";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

// Inicia o servidor
AppDataSource.initialize().then(() => {
  // CLIENTES ---------------------------------------
  const clienteRepository = AppDataSource.getRepository(Cliente);

  // Listar clientes (podendo filtrar por nome ou email e data)
  app.get("/clientes", async (req: any, res: any) => {
    const busca = req.query.search;
    const date = req.query.date;

    const filters: any[] = [];

    let dataInicial = null;
    let dataFinal = null;

    // Cria as datas inicial e final
    if (date) {
      dataInicial = new Date(date);
      dataFinal = new Date(date);
      dataFinal.setUTCHours(23, 59, 59, 999);
    }

    // Busca por nome ou email
    if (busca) {
      filters.push(
        date
          ? {
              nome: ILike(`%${busca}%`),
              createdAt: Between(dataInicial, dataFinal),
            }
          : { nome: ILike(`%${busca}%`) },
      );

      filters.push(
        date
          ? {
              email: ILike(`%${busca}%`),
              createdAt: Between(dataInicial, dataFinal),
            }
          : { email: ILike(`%${busca}%`) },
      );
    }

    // Filtra só data (sem busca)
    if (date && !busca) {
      filters.push({ createdAt: Between(dataInicial, dataFinal) });
    }

    const clientes = await clienteRepository.find({
      where: filters.length ? filters : {},
      relations: ["enderecos"],
      order: { createdAt: "DESC" },
    });

    res.json(clientes);
  });

  // Buscar cliente pelo Id
  app.get("/clientes/:id", async (req: any, res: any) => {
    const id = req.params.id;

    const cliente = await clienteRepository.findOne({
      where: { id: Number(id) },
      relations: ["enderecos"],
    });

    res.json(cliente);
  });

  // Criar cliente
  app.post("/clientes", async (req: any, res: any) => {
    const newCliente = await clienteRepository.save(req.body);

    res.json(newCliente);
  });

  // Atualizar cliente
  app.put("/clientes/:id", async (req: any, res: any) => {
    const clienteId = req.params.id || undefined;

    const cliente = await clienteRepository.findOne({
      where: { id: Number(clienteId) },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const novoCliente = {
      nome: req.body.nome || cliente.nome,
      email: req.body.email || cliente.email,
      whatsapp: req.body.whatsapp || cliente.whatsapp,
      tipo: req.body.tipo || cliente.tipo,
      cpf: req.body.cpf || cliente.cpf,
      cnpj: req.body.cnpj || cliente.cnpj,
    };

    const novoClienteSalvo = await clienteRepository.update(
      { id: Number(clienteId) },
      novoCliente,
    );

    res.json(novoClienteSalvo);
  });

  // Excluir cliente
  app.delete("/clientes/:id", async (req: any, res: any) => {
    const clienteId = req.params.id;

    await clienteRepository.delete({ id: Number(clienteId) });

    res.json("Cliente removido com sucesso!");
  });

  // ENDEREÇOS -------------------------------------------
  const enderecoRepository = AppDataSource.getRepository(Endereco);

  // Listar endereços
  app.get("/enderecos", async (req: any, res: any) => {
    const enderecos = await enderecoRepository.find();
    res.json(enderecos);
  });

  // Buscar endereço pelo Id
  app.get("/enderecos/:id", async (req: any, res: any) => {
    const enderecoId = req.params?.id || undefined;

    const endereco = await enderecoRepository.findOne({
      where: { id: Number(enderecoId) },
    });

    res.json(endereco);
  });

  // Criar endereço
  app.post("/enderecos", async (req: any, res: any) => {
    const novoEndereco = await enderecoRepository.save(req.body);

    res.json(novoEndereco);
  });

  // Atualizar endereço
  app.put("/enderecos/:id", async (req: any, res: any) => {
    const enderecoId = req.params.id || undefined;

    const endereco = await enderecoRepository.findOne({
      where: { id: Number(enderecoId) },
    });

    if (!endereco) {
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    const novoEndereco = {
      id: endereco.id,
      cep: req.body.cep || endereco.cep,
      rua: req.body.rua || endereco.rua,
      bairro: req.body.bairro || endereco.bairro,
      cidade: req.body.cidade || endereco.cidade,
    };

    const enderecoAtualizado = await enderecoRepository.update(
      { id: Number(enderecoId) },
      novoEndereco,
    );

    res.json(enderecoAtualizado);
  });

  // Excluir endereço
  app.delete("/enderecos/:id", async (req: any, res: any) => {
    const enderecoId = req.params.id;

    const endereco = await enderecoRepository.findOne({
      where: { id: Number(enderecoId) },
    });

    if (!endereco) {
      res.status(404).json("Endereço não encontrado");
      return;
    }

    await enderecoRepository.remove(endereco);

    res.json("Cliente removido com sucesso!");
  });

  // Outros -------------------

  // Vincular cliente a endereço
  app.post("/vincular-endereco", async (req: any, res: any) => {
    const clienteId = req.body.clienteId;
    const enderecoId = req.body.enderecoId;

    const cliente = await clienteRepository.findOne({
      where: { id: Number(clienteId) },
      relations: ["enderecos"],
    });
    const endereco = await enderecoRepository.findOne({
      where: { id: Number(enderecoId) },
    });

    if (!cliente || !endereco) {
      res.status(404).json("Não encontrado");
      return;
    }

    // Checa se o cliente ja tem esse endereço
    if (cliente.enderecos.includes(endereco)) {
      res("Cliente já possui este endereço vinculado!");
      return;
    }

    // Adiciona o novo endereço a lista
    cliente?.enderecos.push(endereco);

    // Salva a relação many-to-many corretamente
    await clienteRepository.save(cliente);

    res.status(201).json({ message: "Endereço vinculado com sucesso" });
  });

  app.listen(PORT, () => {
    console.log("Servidor está rodando: " + PORT);
  });
});
