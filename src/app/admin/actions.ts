"use server";

import { refresh } from "next/cache";
import { requireUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { MEMBER_TEAMS } from "../../lib/org";
import { canManageOrg } from "../../lib/permissions";
import type { Role } from "../../types";

const ROLES: Role[] = ["admin", "leader", "member"];

export async function updateUser(userId: string, formData: FormData) {
  const actor = await requireUser();
  if (!canManageOrg(actor)) return;

  const role = String(formData.get("role")) as Role;
  const teamId = String(formData.get("teamId") ?? "");
  if (!ROLES.includes(role)) return;
  if (teamId && !MEMBER_TEAMS.some((t) => t.id === teamId)) return;
  // Non-admins must belong to a team; admins may sit above the org chart.
  if (role !== "admin" && !teamId) return;
  // Don't let an admin lock themselves out.
  if (userId === actor.id && role !== "admin") return;

  db.users.update(userId, { role, teamId: teamId || null });
  refresh();
}
