import { NextResponse } from "next/server";
import db, { parseJsonFields } from "@/lib/db";

interface HeroRow {
  id: number;
  data: string;
  created_date: string;
  updated_date: string;
  guess_counter: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const returnFields = searchParams.getAll("returnFields");
  const filterBy = searchParams.getAll("filterBy");
  const filters: string[] = [];
  const values: (string | number | null)[] = [];

  let query = "SELECT * FROM heroes";

  if (returnFields.length > 0) {
    // SQLite JSON extraction syntax
    const jsonFields = returnFields
      .map((field) => `json_extract(data, '$.${field}') AS "${field}"`)
      .join(", ");
    query = `SELECT id, ${jsonFields} FROM heroes`;
  }

  filterBy.forEach((field) => {
    const value = searchParams.get(field);
    if (value) {
      filters.push(`${field} = ?`);
      values.push(value);
    }
  });

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  try {
    const { rows } = await db.query<HeroRow>(query, values);
    // Only parse JSON if selecting full data column
    const result = returnFields.length > 0 ? rows : parseJsonFields(rows);
    console.log(result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, statusCode: 500 },
      { status: 500 }
    );
  }
}
