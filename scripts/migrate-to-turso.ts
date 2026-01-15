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
  for (const hero of heroesData) {
    await client.execute({
      sql: "INSERT OR REPLACE INTO heroes (id, data, created_date, updated_date, guess_counter) VALUES (?, ?, ?, ?, ?)",
      args: [
        Number(hero.id),
        hero.data,
        hero.created_date,
        hero.updated_date,
        Number(hero.guess_counter) || 0,
      ],
    });
  }
  console.log(`  Inserted ${heroesData.length} heroes`);

  // Insert guesses
  console.log("Inserting guesses...");
  for (const guess of guessesData) {
    await client.execute({
      sql: "INSERT OR REPLACE INTO guesses (id, entity_id, entity_type, data, created_date, updated_date, guess_date, correct_guess) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        Number(guess.id),
        Number(guess.entity_id),
        guess.entity_type,
        guess.data,
        guess.created_date,
        guess.updated_date,
        guess.guess_date,
        Number(guess.correct_guess) || 0,
      ],
    });
  }
  console.log(`  Inserted ${guessesData.length} guesses`);

  // Insert items
  console.log("Inserting items...");
  for (const item of itemsData) {
    await client.execute({
      sql: "INSERT OR REPLACE INTO items (id, data, created_date, updated_date, correct_guess) VALUES (?, ?, ?, ?, ?)",
      args: [
        Number(item.id),
        item.data,
        item.created_date,
        item.updated_date,
        Number(item.correct_guess) || 0,
      ],
    });
  }
  console.log(`  Inserted ${itemsData.length} items`);

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
