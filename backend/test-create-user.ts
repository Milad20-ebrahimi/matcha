import "dotenv/config";

import bcrypt from "bcrypt";
import { db } from "./src/database/index.js";
import { users } from "./src/database/schema/index.js";

const CUSTOMER_ROLE_ID =
  "8e83e25b-1388-408a-960e-570c37a19c0e";

async function main() {
  const passwordHash = await bcrypt.hash(
    "Test123456",
    10,
  );

  const [user] = await db
    .insert(users)
    .values({
      roleId: CUSTOMER_ROLE_ID,
      email: "cart-test@matcha.ir",
      firstName: "Cart",
      lastName: "Test",
      passwordHash,
      emailVerified: true,
      phoneVerified: false,
    })
    .onConflictDoNothing()
    .returning();

  console.log(user);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});