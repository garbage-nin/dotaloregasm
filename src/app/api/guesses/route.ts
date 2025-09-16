import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { createGuess } from "@/lib/apiHelper";
export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM guesses WHERE guess_date::DATE = CURRENT_DATE LIMIT 1"
    );

    if (rows.length === 0) {
      const result = await createGuess();
      return NextResponse.json({ ...result, statusCode: 200 }, { status: 200 });
    }

    // TODO: remove hero name from response
    return NextResponse.json({ ...rows[0], statusCode: 200 }, { status: 200 });
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
    const result = await pool.query(
      "UPDATE guesses SET correct_guess = correct_guess + 1 WHERE id = $1 RETURNING *",
      [guessId]
    );

    return NextResponse.json(
      { ...result.rows[0], statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message, status: 500 },
      { status: 500 }
    );
  }
}
