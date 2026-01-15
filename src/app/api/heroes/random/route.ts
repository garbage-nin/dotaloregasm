import { NextResponse } from "next/server";
import db, { parseJsonField } from "@/lib/db";

interface HeroRow {
  id: number;
  data: string;
  created_date: string;
  updated_date: string;
  guess_counter: number;
}

export async function GET() {
  try {
    const { rows } = await db.query<HeroRow>(
      "SELECT * FROM heroes ORDER BY RANDOM() LIMIT 1;"
    );
    const parsed = parseJsonField(rows[0]);
    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, statusCode: 500 },
      { status: 500 }
    );
  }
}
