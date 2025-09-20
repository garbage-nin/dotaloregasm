import { Pool } from "pg";
import env from "dotenv";

env.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // for self-signed certs, otherwise set to true
  },
});

export default pool;
