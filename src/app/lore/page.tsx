import { fetchApi } from "@/lib/fetch";
import { LoreForm } from "./component/lore-form";
import { GuessesType } from "@/types/dotalore";
export default async function LorePage() {
  const parameters = {
    returnFields: ["name_loc", "name"],
  };

  // Fetch heroes and guesses in parallel to reduce load time
  const [heroesResp, guessResp] = await Promise.all([
    fetchApi<any>("heroes", parameters),
    fetchApi<any>("guesses") as Promise<GuessesType>,
  ]);
  const heroeList = heroesResp.map((hero: any) => ({
    id: hero.id,
    label: hero.name_loc,
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/${hero.name.replace(
      "npc_dota_hero_",
      "",
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
