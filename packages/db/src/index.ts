export { db } from "./prisma/db.js";

import type { Models } from "./prisma/contract.js";
import type { Scalars } from "@prisma/orm-postgres/family-contract/types";

export type User = Scalars<Models.public_User>;
