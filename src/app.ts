import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import express, { Application, Request, Response, NextFunction } from "express";

import routes from "./routes";

// Carregar variáveis de ambiente
dotenv.config();

const app: Application = express();

// Middleware de CORS (permitir acesso de origens diferentes, útil para APIs públicas)
app.use(cors());

// Middleware para logs (exibe detalhes das requisições no console)
app.use(morgan("dev"));

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware para parsear dados de formulário (caso necessário)
app.use(express.urlencoded({ extended: true }));

// Rotas da aplicação
app.use("/api", routes);

// Middleware para tratamento de erros
// app.use(middleware);

// Middleware para rotas não encontradas
app.use((req: Request, res: Response) => {
	res.status(404).json({ message: "Rota não encontrada" });
});

export default app;
