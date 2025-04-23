import pool from "@/lib/db";
import { getChatCompletion } from "@/lib/openai";
import { ROLES, PRIMARY_ATTRIBUTE, ATTACK_TYPE } from "@/constants/hero";

export async function createGuess() {
  // get first a random hero
  const { rows: heroes } = await pool.query(
    "SELECT * FROM heroes ORDER BY RANDOM() LIMIT 1;"
  );

  let heroId = heroes[0].id;
  let heroName = heroes[0].data.name_loc;
  let lore = heroes[0].data.bio_loc;

  let skillLore = heroes[0].data.abilities
    .map((ability: any) => ability.lore_loc)
    .filter((lore: string) => lore.trim() !== "");

  const { lore: rephraseLoreResponse, skillLoreResponse } =
    await parseLoreSkillDetails(lore, skillLore);

  let guessData = {
    guess_hero_name: heroName,
    guess_hero_id: heroId,
    guess_skill_lore: skillLoreResponse,
    guess_lore: rephraseLoreResponse,
    guess_base_name: heroes[0].data.name.replace("npc_dota_hero_", ""),
    primary_attribute: PRIMARY_ATTRIBUTE[heroes[0].data.primary_attr],
    attack_type: ATTACK_TYPE[heroes[0].data.attack_capability - 1],
    roles: ROLES.filter((_, index) => heroes[0].data.role_levels[index] !== 0),
  };

  const result = await pool.query(
    "INSERT INTO guesses (entity_id, entity_type, data, created_date, updated_date, correct_guess, guess_date) VALUES ($1, $2, $3, NOW(), NOW(), 0, NOW()) RETURNING *;",
    [heroId, "hero", guessData]
  );

  if (result?.rowCount && result.rowCount > 0) {
    updateSelectedHero(heroId);
    return result.rows[0];
  }

  return null;
}

function updateSelectedHero(heroId: number) {
  const query = `
    UPDATE heroes 
    SET 
      updated_date = NOW(), 
      guess_counter = guess_counter + 1 
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const updateHeroResult = pool.query(query, [heroId]);
    console.log("updateHeroResult: ", heroId);
  } catch (error) {
    console.log("updateHeroError: ", error);
  }
}

async function parseLoreSkillDetails(lore: string, skillLore: string) {
  const rephraseLoreResponse = await getChatCompletion([
    {
      role: "system",
      content: `You are a writer, book reader, and Dota fan. Your task is to summarize into 10 max sentence the provided lore while removing any proper nouns (e.g., hero names, locations, and specific character names). Additionally, avoid mentioning any species, races, or entity classifications (e.g., trolls, ogres, humans, elves, demons). Ensure the summary retains the meaning and essence of the original story without referring to specific names or classifications. `,
    },
    {
      role: "user",
      content: `Here is the lore: "${lore}". Please summarize it in only max 10 sentence. Remove all proper nouns, including character names, locations, and organizations. Additionally, do not mention any species, races, or entity classifications (e.g., trolls, ogres, humans, elves, demons). Ensure the summary retains the meaning and essence of the original story without referring to specific names or classifications.`,
    },
  ]);

  const skillLoreResponse = await getChatCompletion([
    {
      role: "system",
      content: `You are a writer, book reader, and Dota fan. Your task is to rephrase the sentence while removing any proper nouns. Additionally, do not mention any species, races, or entity classifications. The response should looks the same and an array of strings. `,
    },
    {
      role: "user",
      content: `Rephrase the sentence while removing any proper nouns. Additionally, do not mention any species, races, or entity classifications. The response should looks the same and an array of strings. Here is the sentence: "${skillLore}"`,
    },
  ]);

  return {
    lore: rephraseLoreResponse,
    skillLoreResponse: skillLoreResponse,
  };
}
