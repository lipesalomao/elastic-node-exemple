import express, { Request, Response } from "express";
import getClient from "./client/elasticsearch";

import PessoaController from "./pessoaController";
const app = express();

app.get("/", async (req: Request, res: Response) => {
  const client = getClient();
  const result = await client.index({
    index: "pessoas",
    type: "type_pessoas",
    body: {
      user: "Felipe",
      password: "123456",
      email: "felipe.salomao.f@gmail.com",
    },
  });

  return res.json(result);
});

app.get("/pessoas/create", PessoaController.create);
app.get("/pessoas/createPessoa", PessoaController.createPessoa);
app.get("/pessoas/findAll", PessoaController.findAll);
app.get("/pessoas/findById/:id", PessoaController.findById);
app.get("/pessoas/findByQuery", PessoaController.findByQuery);
app.get("/pessoas/findByLikeQuery", PessoaController.findByLikeQuery);
app.get("/pessoas/deleteByQuery", PessoaController.deleteByQuery);

app.listen(3333, () => {
  console.warn("Server started");
});
