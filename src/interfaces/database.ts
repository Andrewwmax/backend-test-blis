export interface User {
	id: string;
	name: string;
	birthdate: Date;
	email: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}

export interface UserDocument {
	id: string;
	name: string;
	url: string;
	user_id: string;
	created_at: Date;
	updated_at: Date;
}

export interface Ability {
	id: string;
	name: string;
	active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface UserAbility {
	id: string;
	user_id: string;
	ability_id: string;
	years_experience: number;
	created_at: Date;
	updated_at: Date;
}
