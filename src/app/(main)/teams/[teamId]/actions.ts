"use server";

import { refresh } from "next/cache";
import { requireUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { canCreateItem, canManageItem } from "../../../../lib/permissions";

export async function addItem(teamId: string, formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title || !canCreateItem(user, teamId)) return;
  db.items.create({ teamId, ownerId: user.id, title });
  refresh();
}

export async function deleteItem(itemId: string) {
  const user = await requireUser();
  const item = db.items.byId(itemId);
  if (!item || !canManageItem(user, item)) return;
  db.items.remove(itemId);
  refresh();
}
