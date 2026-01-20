import { createClient, Row } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export interface QueryResult<T = Row> {
  rows: T[];
  rowCount: number;
}

export async function query<T = Row>(
  sql: string,
  args: (string | number | null)[] = [],
): Promise<QueryResult<T>> {
  const result = await client.execute({ sql, args });
  return {
    rows: result.rows as T[],
    rowCount: result.rowsAffected,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonField<T extends Record<string, any>>(row: T): T {
  if (row && typeof row.data === "string") {
    return { ...row, data: JSON.parse(row.data) };
  }
  return row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonFields<T extends Record<string, any>>(rows: T[]): T[] {
  return rows.map(parseJsonField);
}

export { client };
export default { query, parseJsonField, parseJsonFields, client };
