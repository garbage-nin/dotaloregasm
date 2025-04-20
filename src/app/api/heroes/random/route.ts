import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM heroes ORDER BY RANDOM() LIMIT 1;"
    );
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, statusCode: 500 },
      { status: 500 }
    );
  }
}
