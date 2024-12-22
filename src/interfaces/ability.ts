interface Ability {
	id: string;
	name: string;
	active: boolean;
	// Add other properties as needed
}

interface CreateAbilityService {
	(name: string): Promise<Ability>;
}

interface UpdateAbilityStatusService {
	(id: string, active: boolean): Promise<Ability>;
}

interface AssignAbilityToUserService {
	(user_id: string, ability_id: string, years_experience: number): Promise<UserAbility>;
}

interface DeleteUserAbilitiesService {
	(ids: string[]): Promise<{ ids: string[] }>;
}

interface ListUserAbilitiesService {
	(user_id: string, page: number, limit: number): Promise<{ abilities: UserAbility[]; total: number }>;
}
