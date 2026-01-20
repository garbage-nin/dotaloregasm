import db, { parseJsonField, parseJsonFields } from "@/lib/db";
import { getChatCompletion } from "@/lib/openai";
import { ROLES, PRIMARY_ATTRIBUTE, ATTACK_TYPE } from "@/constants/hero";

interface HeroRow {
  id: number;
  data: {
    name: string;
    name_loc: string;
    bio_loc: string;
    primary_attr: number;
    attack_capability: number;
    role_levels: number[];
    abilities: { lore_loc: string }[];
  };
  created_date: string;
  updated_date: string;
  guess_counter: number;
}

interface GuessRow {
  id: number;
  entity_id: number;
  entity_type: string;
  data: string;
  created_date: string;
  updated_date: string;
  guess_date: string;
  correct_guess: number;
}

export async function createGuess() {
  // get first a random hero
  const { rows: heroesRaw } = await db.query<HeroRow>(
    "SELECT * FROM heroes ORDER BY RANDOM() LIMIT 1;"
  );

  const heroes = parseJsonFields(heroesRaw);

  const heroId = heroes[0].id;
  const heroName = heroes[0].data.name_loc;
  const lore = heroes[0].data.bio_loc;

  const skillLore = heroes[0].data.abilities
    .map((ability) => ability.lore_loc)
    .filter((lore: string) => lore.trim() !== "");

  const { lore: rephraseLoreResponse, skillLoreResponse } =
    await parseLoreSkillDetails(lore, skillLore);

  const guessData = {
    guess_hero_name: heroName,
    guess_hero_id: heroId,
    guess_skill_lore: skillLoreResponse,
    guess_lore: rephraseLoreResponse,
    guess_base_name: heroes[0].data.name.replace("npc_dota_hero_", ""),
    primary_attribute: PRIMARY_ATTRIBUTE[heroes[0].data.primary_attr],
    attack_type: ATTACK_TYPE[heroes[0].data.attack_capability - 1],
    roles: ROLES.filter((_, index) => heroes[0].data.role_levels[index] !== 0),
  };

  const result = await db.query<GuessRow>(
    "INSERT INTO guesses (entity_id, entity_type, data, created_date, updated_date, correct_guess, guess_date) VALUES (?, ?, ?, datetime('now'), datetime('now'), 0, datetime('now')) RETURNING *;",
    [heroId, "hero", JSON.stringify(guessData)]
  );

  if (result?.rowCount && result.rowCount > 0) {
    updateSelectedHero(heroId);
    return parseJsonField(result.rows[0]);
  }

  return null;
}

async function updateSelectedHero(heroId: number) {
  const query = `
    UPDATE heroes
    SET
      updated_date = datetime('now'),
      guess_counter = guess_counter + 1
    WHERE id = ?
    RETURNING *;
  `;

  try {
    await db.query(query, [heroId]);
    console.log("updateHeroResult: ", heroId);
  } catch (error) {
    console.log("updateHeroError: ", error);
  }
}

async function parseLoreSkillDetails(lore: string, skillLore: string[]) {
  // Run both OpenAI calls in parallel to reduce latency
  const [rephraseLoreResponse, skillLoreResponse] = await Promise.all([
    getChatCompletion([
      {
        role: "system",
        content: `You are a writer, book reader, and Dota fan. Your task is to summarize into 10 max sentence the provided lore while removing any proper nouns (e.g., hero names, locations, and specific character names). Additionally, avoid mentioning any species, races, or entity classifications (e.g., trolls, ogres, humans, elves, demons). Ensure the summary retains the meaning and essence of the original story without referring to specific names or classifications. `,
      },
      {
        role: "user",
        content: `Here is the lore: "${lore}". Please summarize it in only max 10 sentence. Remove all proper nouns, including character names, locations, and organizations. Additionally, do not mention any species, races, or entity classifications (e.g., trolls, ogres, humans, elves, demons). Ensure the summary retains the meaning and essence of the original story without referring to specific names or classifications.`,
      },
    ]),
    getChatCompletion([
      {
        role: "system",
        content: `You are a writer, book reader, and Dota fan. Your task is to rephrase the sentence while removing any proper nouns. Additionally, do not mention any species, races, or entity classifications. The response should looks the same and an array of strings. `,
      },
      {
        role: "user",
        content: `Rephrase the sentence while removing any proper nouns. Additionally, do not mention any species, races, or entity classifications. The response should looks the same and an array of strings. Here is the sentence: "${skillLore.join(", ")}"`,
      },
    ]),
  ]);

  return {
    lore: rephraseLoreResponse,
    skillLoreResponse: skillLoreResponse,
  };
}
