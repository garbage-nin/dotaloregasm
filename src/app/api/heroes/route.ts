import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const returnFields = searchParams.getAll("returnFields");
  const filterBy = searchParams.getAll("filterBy");
  const filters: string[] = [];
  const values: any[] = [];

  let query = "SELECT * FROM heroes";

  if (returnFields.length > 0) {
    const jsonFields = returnFields
      .map((field) => `data->>'${field}' AS "${field}"`)
      .join(", ");
    query = `SELECT id,  ${jsonFields} FROM heroes`;
  }

  filterBy.forEach((field, index) => {
    const value = searchParams.get(field);
    if (value) {
      filters.push(`${field} = $${index + 1}`);
      values.push(value);
    }
  });

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  try {
    const { rows } = await pool.query(query, values);
    console.log(rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, statusCode: 500 },
      { status: 500 }
    );
  }
}
