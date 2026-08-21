import "dotenv/config";

import { db } from "./index.js";
import { roles } from "./schema/role.schema.js";

const defaultRoles = [
  {
    name: "CUSTOMER",
  },
  {
    name: "ADMIN",
  },
  {
    name: "STAFF",
  },
];

async function seed() {
  console.log("Starting database seed...");

  await db
    .insert(roles)
    .values(defaultRoles)
    .onConflictDoNothing();

  console.log("Roles seeded successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(() => {
    console.log("Seed finished.");
  });