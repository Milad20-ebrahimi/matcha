import "dotenv/config";

import { db } from "./src/database/index.js";
import { users } from "./src/database/schema/index.js";

async function main() {
  const rows = await db
    .select({
      id: users.id,
      phone: users.phone,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users);

  console.log(rows);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});