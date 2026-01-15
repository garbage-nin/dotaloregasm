import { NextRequest, NextResponse } from "next/server";
import db, { parseJsonField } from "@/lib/db";
import { createGuess } from "@/lib/apiHelper";

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

export async function POST() {
  try {
    const { rows: guess } = await db.query<GuessRow>(
      "SELECT * FROM guesses WHERE date(guess_date) = date('now') LIMIT 1"
    );

    if (guess.length === 1) {
      const parsed = parseJsonField(guess[0]);
      return NextResponse.json({ ...parsed, statusCode: 200 }, { status: 200 });
    }

    const result = await createGuess();
    return NextResponse.json({ ...result, statusCode: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, statusCode: 500 },
      { status: 500 }
    );
  }
}
