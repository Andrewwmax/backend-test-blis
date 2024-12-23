export interface UserAbility {
	id: string;
	user_id: string; // FK para Users
	ability_id: string; // FK para Abilities
	years_experience: number;
	created_at: Date;
	updated_at: Date;
}
