import { Request, Response } from "express";

export interface User {
	id: string;
	name: string;
	birthdate: Date;
	email: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}

export type GetUserByEmail = User | null;

export interface RequestWithAuthHeader extends Request {
	headers: {
		authorization?: string;
	};
}

export interface UserLoginRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

export interface UserLoginResponse extends Response {
	message?: string;
	token?: string;
}

export interface UserCreateRequest extends Request {
	body: {
		name: string;
		birthdate: Date;
		email: string;
		password: string;
	};
}
export interface UserCreateResponse extends Response {
	message?: string;
	user?: User;
}
