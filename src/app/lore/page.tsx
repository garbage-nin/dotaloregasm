import { fetchApi } from "@/lib/fetch";
import { LoreForm } from "./component/lore-form";
import { GuessesType } from "@/types/dotalore";
export default async function LorePage() {
  const parameters = {
    returnFields: ["name_loc", "name"],
  };
  const heroesResp = await fetchApi<any>("heroes", parameters);
  console.log(heroesResp);
  const guessResp: GuessesType = await fetchApi<any>("guesses");
  const heroeList = heroesResp.map((hero: any) => ({
    id: hero.id,
    label: hero.name_loc,
    image: `${process.env.CDN_URL}/${hero.name.replace(
      "npc_dota_hero_",
      ""
    )}.png`,
  }));

  return (
    <div className="flex flex-col items-center ">
      {guessResp.statusCode === 200 && (
        <LoreForm
          dropdownValues={heroeList}
          guessDetails={guessResp}
        ></LoreForm>
      )}
    </div>
  );
}
