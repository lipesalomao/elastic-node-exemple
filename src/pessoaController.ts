import { Request, Response } from "express";
import getClient from "./client/elasticsearch";
import { pessoas } from "../db/db";

class PessoaController {
  async create(request: Request, response: Response) {
    const client = getClient();
    for await (let pessoa of pessoas) {
      await client.index(
        {
          index: "pessoas",
          type: "type_pessoas",
          body: pessoa,
        },
        (err) => {
          if (err) {
            console.error(err);
            return response.json(err);
          }
        }
      );
    }
    console.info("Pessoas cadastradas com sucesso");
    return response.json({ message: "Pessoas cadastradas com sucesso" });
  }

  async createPessoa(request: Request, response: Response) {
    const client = getClient();
    const pessoa = {
      id: "ABC123",
      nome: "Felipe",
      idade: "30",
      email: "felipe.salomao.f@gmail.com",
      telefone: "11999999999",
    };

    const data = await client.index(
      {
        index: "pessoas",
        type: "type_pessoas",
        body: pessoa,
      },
      (err) => {
        if (err) {
          console.error(err);
          return response.json(err);
        }
      }
    );

    return response.json(data);
  }


  async findAll(request: Request, response: Response) {
    const client = getClient();
    const data = await client.search({
      index: "pessoas",
      size: 100,
    });

    console.log(response.json(data));
    return response.json(data);
  }


  async findById(request: Request, response: Response) {
    const client = getClient();
    const { id } = request.params;
    const data = await client.search({ // procurar por ABC123 (teste)
      q: `id:${id}`,
    });
    return response.json(data.hits.hits);
  }


  async findByQuery(request: Request, response: Response) {
    const client = getClient();

    const data = await client.search({
      index: "pessoas",
      body: {
        query: {
          term: {
            "nome.keyword": "Felipe",
          },
        },
      },
    });

    return response.json(data);
  }


  async findByLikeQuery(request: Request, response: Response) {
    const client = getClient();

    const data = await client.search({
      index: "pessoas",
      body: {
        query: {
          match: {
            sexo: "feminino",
          },
        },
      },
    });

    return response.json(data);
  }

  async deleteByQuery(request: Request, response: Response) {
    const client = getClient();

    const data = await client.deleteByQuery({
      index: "pessoas",
      body: {
        query: {
          match: {
            email: "felipe.salomao.f@gmail.com",
          },
        },
      },
    });

    return response.json(data);
  }

}

export default new PessoaController();
