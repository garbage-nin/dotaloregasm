import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// SQLite Schema
const schema = `
CREATE TABLE IF NOT EXISTS guesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    data TEXT NOT NULL,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now')),
    guess_date TEXT,
    correct_guess INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS heroes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now')),
    guess_counter INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now')),
    correct_guess INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_guesses_date ON guesses(date(guess_date));
`;

// Safely parse integer with fallback
function safeInt(value: string | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined || value === "\\N") {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Unescape PostgreSQL COPY format for valid JSON
function unescapePgCopy(value: string | null): string | null {
  if (value === null) return null;

  // The dump file has double backslashes (\\r, \\n, \\t) that need to become
  // single backslashes (\r, \n, \t) for valid JSON escape sequences.
  //
  // In the raw file: \\r\\n\\t (each is two backslash chars + letter)
  // In JS string after reading: each \\x is still two backslashes + letter
  // For valid JSON: need single backslash + letter (\r, \n, \t)

  let result = value;

  // Convert double-backslash escapes to single-backslash JSON escapes
  // In regex: \\\\ matches two literal backslashes
  result = result.replace(/\\\\r/g, "\\r");
  result = result.replace(/\\\\n/g, "\\n");
  result = result.replace(/\\\\t/g, "\\t");
  result = result.replace(/\\\\"/g, '\\"');  // Escaped quotes

  // Handle quadruple backslash (\\\\) which should become double backslash (\\)
  result = result.replace(/\\\\\\\\/g, "\\\\");

  // Verify it's valid JSON
  try {
    JSON.parse(result);
    return result;
  } catch (e) {
    console.error("JSON parse failed:", (e as Error).message);
    return value;
  }
}

// Parse PostgreSQL COPY data format (tab-separated)
function parseCopyLine(
  line: string,
  columns: string[]
): Record<string, string | null> {
  const values = line.split("\t");
  const record: Record<string, string | null> = {};

  columns.forEach((col, index) => {
    let value = values[index];
    if (value === "\\N") {
      record[col] = null;
    } else {
      record[col] = value;
    }
  });

  return record;
}

async function migrate() {
  console.log("Starting migration to Turso...\n");

  // Create schema
  console.log("Creating schema...");
  const schemaStatements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of schemaStatements) {
    await client.execute(stmt);
  }
  console.log("Schema created successfully!\n");

  // Read and parse dump.sql
  const dumpPath = path.join(process.cwd(), "dump.sql");
  console.log(`Reading dump file: ${dumpPath}`);
  const dump = fs.readFileSync(dumpPath, "utf-8");
  const lines = dump.split("\n");

  // Parse COPY blocks
  let currentTable: string | null = null;
  let currentColumns: string[] = [];
  let inCopyBlock = false;

  const heroesData: Record<string, string | null>[] = [];
  const guessesData: Record<string, string | null>[] = [];
  const itemsData: Record<string, string | null>[] = [];

  for (const line of lines) {
    // Check for COPY statement start
    const copyMatch = line.match(/^COPY public\.(\w+) \(([^)]+)\) FROM stdin;/);
    if (copyMatch) {
      currentTable = copyMatch[1];
      currentColumns = copyMatch[2].split(", ").map((c) => c.trim());
      inCopyBlock = true;
      console.log(`Found COPY block for table: ${currentTable}`);
      continue;
    }

    // Check for end of COPY block
    if (line === "\\." && inCopyBlock) {
      inCopyBlock = false;
      currentTable = null;
      continue;
    }

    // Process data line
    if (inCopyBlock && currentTable && line.trim()) {
      const record = parseCopyLine(line, currentColumns);

      switch (currentTable) {
        case "heroes":
          heroesData.push(record);
          break;
        case "guesses":
          guessesData.push(record);
          break;
        case "items":
          itemsData.push(record);
          break;
      }
    }
  }

  console.log(`\nParsed data:`);
  console.log(`  Heroes: ${heroesData.length} rows`);
  console.log(`  Guesses: ${guessesData.length} rows`);
  console.log(`  Items: ${itemsData.length} rows`);

  // Insert heroes
  console.log("\nInserting heroes...");
  let heroInserted = 0;
  for (const hero of heroesData) {
    // Skip rows with missing required data
    if (!hero.data || !hero.id) {
      console.log(`  Skipping invalid hero row: id=${hero.id}, has_data=${!!hero.data}`);
      continue;
    }
    await client.execute({
      sql: "INSERT OR REPLACE INTO heroes (id, data, created_date, updated_date, guess_counter) VALUES (?, ?, ?, ?, ?)",
      args: [
        safeInt(hero.id),
        unescapePgCopy(hero.data),
        hero.created_date ?? null,
        hero.updated_date ?? null,
        safeInt(hero.guess_counter, 0),
      ],
    });
    heroInserted++;
  }
  console.log(`  Inserted ${heroInserted} heroes (skipped ${heroesData.length - heroInserted})`);

  // Insert guesses
  console.log("Inserting guesses...");
  let guessInserted = 0;
  for (const guess of guessesData) {
    if (!guess.data || !guess.id) {
      console.log(`  Skipping invalid guess row: id=${guess.id}`);
      continue;
    }
    await client.execute({
      sql: "INSERT OR REPLACE INTO guesses (id, entity_id, entity_type, data, created_date, updated_date, guess_date, correct_guess) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        safeInt(guess.id),
        safeInt(guess.entity_id),
        guess.entity_type ?? "hero",
        unescapePgCopy(guess.data),
        guess.created_date ?? null,
        guess.updated_date ?? null,
        guess.guess_date ?? null,
        safeInt(guess.correct_guess, 0),
      ],
    });
    guessInserted++;
  }
  console.log(`  Inserted ${guessInserted} guesses`);

  // Insert items
  console.log("Inserting items...");
  let itemInserted = 0;
  for (const item of itemsData) {
    if (!item.data || !item.id) {
      continue;
    }
    await client.execute({
      sql: "INSERT OR REPLACE INTO items (id, data, created_date, updated_date, correct_guess) VALUES (?, ?, ?, ?, ?)",
      args: [
        safeInt(item.id),
        unescapePgCopy(item.data),
        item.created_date ?? null,
        item.updated_date ?? null,
        safeInt(item.correct_guess, 0),
      ],
    });
    itemInserted++;
  }
  console.log(`  Inserted ${itemInserted} items`);

  // Verify counts
  console.log("\nVerifying migration...");
  const heroCount = await client.execute("SELECT COUNT(*) as count FROM heroes");
  const guessCount = await client.execute("SELECT COUNT(*) as count FROM guesses");
  const itemCount = await client.execute("SELECT COUNT(*) as count FROM items");

  console.log(`  Heroes in DB: ${heroCount.rows[0].count}`);
  console.log(`  Guesses in DB: ${guessCount.rows[0].count}`);
  console.log(`  Items in DB: ${itemCount.rows[0].count}`);

  console.log("\nMigration complete!");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
