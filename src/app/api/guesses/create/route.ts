import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createGuess } from "@/lib/apiHelper";
export async function POST() {
  try {
    const { rows: guess } = await pool.query(
      "SELECT * FROM guesses WHERE guess_date::DATE = CURRENT_DATE LIMIT 1"
    );

    if (guess.length === 1) {
      return NextResponse.json(
        { ...guess[0], statusCode: 200 },
        { status: 200 }
      );
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
