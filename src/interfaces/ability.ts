import { UserAbility } from "./userAbility";

export interface Ability {
	id: string;
	name: string;
	active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CreateAbilityResponse {
	message: string;
	ability: Ability;
}

export interface UpdateAbilityResponse {
	message: string;
	ability: Ability;
}

export interface AssignAbilityResponse {
	message: string;
	userAbility: UserAbility | null;
}
export interface DeleteAbilityResponse {
	message: string;
	abilities: Ability[];
}
export interface ListUserAbilityResponse {
	message: string;
	abilities: UserAbility[];
}
export interface ListAbilitiesResponse {
	message: string;
	abilities: UserAbility[];
}

export type deleteUserAbilitiesResponse = any;
