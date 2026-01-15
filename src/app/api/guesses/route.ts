import { NextResponse, NextRequest } from "next/server";
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

export async function GET(req: NextRequest) {
  try {
    const { rows } = await db.query<GuessRow>(
      "SELECT * FROM guesses WHERE date(guess_date) = date('now') LIMIT 1"
    );

    if (rows.length === 0) {
      const result = await createGuess();
      return NextResponse.json({ ...result, statusCode: 200 }, { status: 200 });
    }

    const parsed = parseJsonField(rows[0]);
    return NextResponse.json({ ...parsed, statusCode: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const guessId = body.guess_id;
    const result = await db.query<GuessRow>(
      "UPDATE guesses SET correct_guess = correct_guess + 1 WHERE id = ? RETURNING *",
      [guessId]
    );

    const parsed = parseJsonField(result.rows[0]);
    return NextResponse.json({ ...parsed, statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message, status: 500 },
      { status: 500 }
    );
  }
}
