/**
 * Generates a password hash for a manual admin reset.
 *
 *   npm run password:hash -- "a long new password"
 *
 * Paste the output into `admin_users.password_hash` via
 * `netlify database connect`. Never store the plain password anywhere.
 */
import { hashPassword } from "../cms/server/auth";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run password:hash -- "your new password"');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Use at least 12 characters.");
    process.exit(1);
  }
  const hash = await hashPassword(password);
  console.log("\nPassword hash (safe to store):\n");
  console.log(hash);
  console.log(
    "\nThen run this in `netlify database connect`:\n\n  update admin_users set password_hash = '<hash>', failed_attempts = 0, locked_until = null;\n"
  );
}

main();
