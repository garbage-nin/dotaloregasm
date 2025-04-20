export interface GuessesType {
  id: number;
  entity_id: number;
  entity_type: string;
  data: GuessesDataType;
  created_date: string;
  updated_date: string;
  correct_guess: number;
  guess_date: string;
  statusCode: number;
  error?: string;
}

export interface GuessesDataType {
  roles: string[];
  guess_lore: string;
  attack_type: string;
  guess_hero_id: number;
  guess_hero_name: string;
  guess_base_name: string;
  guess_skill_lore: string;
  primary_attribute: string;
}
