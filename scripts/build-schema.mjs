/**
 * Generates `cms/server/schema.generated.ts` from the SQL migrations in
 * `netlify/database/migrations`.
 *
 * Netlify applies those migrations during the deploy lifecycle, but the CMS
 * also runs its own check at cold start (see `cms/server/migrate.ts`). That
 * keeps the panel working when the database is created by another route — for
 * example a plain Postgres/Neon/Supabase connection provided via DATABASE_URL —
 * where Netlify's migration step does not run.
 *
 * Run with: node scripts/build-schema.mjs   (also runs on predev / prebuild)
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MIGRATIONS_DIR = path.join(ROOT, "netlify", "database", "migrations");
const OUTPUT = path.join(ROOT, "cms", "server", "schema.generated.ts");

/** Removes `-- line` comments while leaving quoted text untouched. */
function stripComments(sql) {
  let output = "";
  let quote = null;
  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];
    if (quote) {
      output += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      output += char;
      continue;
    }
    if (char === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i += 1;
      output += "\n";
      continue;
    }
    output += char;
  }
  return output;
}

/** Splits a migration into single statements (no functions/triggers here). */
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let quote = null;
  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === ";") {
      if (current.trim()) statements.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

const files = (await readdir(MIGRATIONS_DIR))
  .filter((file) => file.endsWith(".sql"))
  .sort();

const statements = [];
for (const file of files) {
  const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
  for (const statement of splitStatements(stripComments(sql))) {
    statements.push(statement.replace(/\s+\n/g, "\n").trim());
  }
}

const body = `/**
 * AUTO-GENERATED — do not edit.
 * Source: netlify/database/migrations/*.sql
 * Regenerate with: node scripts/build-schema.mjs
 */
export const SCHEMA_MIGRATIONS = ${JSON.stringify(files, null, 2)} as const;

export const SCHEMA_STATEMENTS: readonly string[] = ${JSON.stringify(statements, null, 2)};
`;

await writeFile(OUTPUT, body, "utf8");
console.log(
  `[schema] ${files.length} migration file(s), ${statements.length} statement(s) → ${path.relative(ROOT, OUTPUT)}`
);
