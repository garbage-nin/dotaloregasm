// app/actions/updateGuess.ts
"use server";
import { fetchApi } from "@/lib/fetch";

export async function updateCorrectGuess(guess_id: number) {
  const body = { guess_id };
  const resp = await fetchApi<any>("guesses", {}, "PUT", body);
  return resp;
}
