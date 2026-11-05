import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Item, User } from "../types";
import { MEMBER_TEAMS } from "./org";

// In-memory store seeded from the staff directory. Resets on server restart;
// replace with the backend API.
//
// Real staff live in data/staff.json (git-ignored: personal data).
// Without it, the fake data/staff.example.json is used.

export const DEMO_PASSWORD = "1234";

const STAFF_FILE = path.join(process.cwd(), "data", "staff.json");
const EXAMPLE_FILE = path.join(process.cwd(), "data", "staff.example.json");

export const USING_EXAMPLE_STAFF = !existsSync(STAFF_FILE);

type StaffRow = Omit<User, "id">;

const rows: StaffRow[] = JSON.parse(readFileSync(USING_EXAMPLE_STAFF ? EXAMPLE_FILE : STAFF_FILE, "utf8"));

const users: User[] = rows
  .filter((r) => r.email)
  .map((r) => ({ ...r, id: `u-${r.email.split("@")[0].toLowerCase()}`, email: r.email.toLowerCase() }));

// A couple of sample items per team so pages aren't empty.
const items: Item[] = MEMBER_TEAMS.flatMap((t) => {
  const members = users.filter((u) => u.teamId === t.id);
  const lead = members.find((u) => u.role === "leader") ?? members[0];
  const member = members.find((u) => u !== lead);
  return [
    lead && { id: `i-${t.id}-1`, teamId: t.id, ownerId: lead.id, title: `${t.name} 주간 회의록`, createdAt: "2026-11-03" },
    member && { id: `i-${t.id}-2`, teamId: t.id, ownerId: member.id, title: `${t.name} 업무 보고`, createdAt: "2026-11-04" },
  ].filter((i): i is Item => Boolean(i));
});

let seq = 0;

export const db = {
  users: {
    all: () => users,
    byId: (id: string) => users.find((u) => u.id === id),
    byEmail: (email: string) => users.find((u) => u.email === email.toLowerCase()),
    inTeam: (teamId: string) => users.filter((u) => u.teamId === teamId),
    update: (id: string, patch: Partial<Pick<User, "role" | "teamId">>) => {
      const user = users.find((u) => u.id === id);
      if (user) Object.assign(user, patch);
    },
  },
  items: {
    byId: (id: string) => items.find((i) => i.id === id),
    inTeam: (teamId: string) => items.filter((i) => i.teamId === teamId),
    create: (data: Omit<Item, "id" | "createdAt">) => {
      items.unshift({ ...data, id: `i-new-${++seq}`, createdAt: new Date().toISOString().slice(0, 10) });
    },
    remove: (id: string) => {
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) items.splice(idx, 1);
    },
  },
};
