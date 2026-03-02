import { createClient, Client, Row } from "@libsql/client";

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return _client;
}

export interface QueryResult<T = Row> {
  rows: T[];
  rowCount: number;
}

export async function query<T = Row>(
  sql: string,
  args: (string | number | null)[] = [],
): Promise<QueryResult<T>> {
  const result = await getClient().execute({ sql, args });
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

export { getClient as client };
export default { query, parseJsonField, parseJsonFields, client: getClient };
