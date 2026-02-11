import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
  }),
  user: ac.newRole({
    ...userAc.statements,
  }),
} as const;

export { ac };
