import request from "supertest";
import { Context } from "./context";
import app from "../src/app";

export async function createUser(user: any, ctx: Context) {
	return await request(app).post("/api/users/login").send({
		email: "maria@email.com",
		password: "senhaSegura123",
	});
}

export async function updateUsername(user: any, ctx: Context) {
	return await ctx.prisma.users.update({
		where: { id: user.id },
		data: user,
	});
}
