import path from "path";
import request from "supertest";

import app from "../../src/app";

describe("POST /users/documents", () => {
	it("Deve fazer upload de um documento com sucesso", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido
		const filePath = path.join(__dirname, `../files/${process.env.TEST_FILE_PDF}`); // Crie um PDF para teste

		const response = await request(app)
			.post("/api/users/documents")
			.set("Authorization", `Bearer ${token}`)
			.field("name", "Disciplina")
			.attach("file", filePath);
		// console.log(filePath);
		// console.log(response.body);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("message", "Documento enviado com sucesso.");
		expect(response.body.document).toHaveProperty("url");
	});

	it("Deve retornar erro 400 se o arquivo nao for enviado", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app)
			.post("/api/users/documents")
			.set("Authorization", `Bearer ${token}`)
			.field("name", "Disciplina");
		// console.log(response.body);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Arquivo não enviado.");
	});

	it("Deve retornar erro 400 se o arquivo for diferente de PDF", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido
		const filePath = path.join(__dirname, `../files/${process.env.TEST_FILE_TXT}`); // Crie um arquivo de texto para teste

		const response = await request(app)
			.post("/api/users/documents")
			.set("Authorization", `Bearer ${token}`)
			.field("name", "Disciplina")
			.attach("file", filePath);

		expect(response.status).toBe(500);
		expect(response.text).toEqual(expect.stringContaining("Error: Apenas arquivos PDF são permitidos."));
	});

	it("Deve retornar todos os documentos de um usuário", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app).get("/api/users/documents").set("Authorization", `Bearer ${token}`);

		// console.log(response.body.message);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("message", "Arquivos recuperados com sucesso.");
		expect(response.body).toHaveProperty("files", expect.any(Array));
		expect(response.body.files.length).toBeGreaterThan(1);
	});

	it("Deve fazer download de um arquivo com sucesso", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido
		const fileId = process.env.TEST_FILE_ID;
		const response = await request(app)
			.get(`/api/users/documents/${fileId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(Buffer.isBuffer(response.body)).toBeTruthy();
		expect(response.body).toBeTruthy();
	});

	it("Deve retornar erro 404 se o documento nao for encontrado para o usuário", async () => {
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido
		const fileId = "invalid-file-id";
		const response = await request(app)
			.get(`/api/users/documents/${fileId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Arquivo não encontrado para este usuário.");
	});
});
