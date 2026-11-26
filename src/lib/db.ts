import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Contact, Item, Product, SentMail, User } from "../types";
import { MEMBER_TEAMS } from "./org";

// In-memory store seeded from the staff directory. Resets on server restart;
// replace with the backend API.
//
// Real staff come from (first match wins):
//   1. STAFF_JSON env var — the contents of staff.json, raw JSON or base64. Use this in
//      production, where the git-ignored file isn't deployed.
//   2. data/staff.json (git-ignored: personal data) — local development.
// Without either, the fake data/staff.example.json is used.

export const DEMO_PASSWORD = "1234";

const STAFF_FILE = path.join(process.cwd(), "data", "staff.json");
const EXAMPLE_FILE = path.join(process.cwd(), "data", "staff.example.json");

type StaffRow = Omit<User, "id">;

function loadStaffFromEnv(): StaffRow[] | null {
  const raw = process.env.STAFF_JSON?.trim();
  if (!raw) return null;
  const text = raw.startsWith("[") ? raw : Buffer.from(raw, "base64").toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("STAFF_JSON is not valid JSON (or base64-encoded JSON)");
  }
}

const envRows = loadStaffFromEnv();

export const USING_EXAMPLE_STAFF = !envRows && !existsSync(STAFF_FILE);

const rows: StaffRow[] =
  envRows ?? JSON.parse(readFileSync(USING_EXAMPLE_STAFF ? EXAMPLE_FILE : STAFF_FILE, "utf8"));

if (USING_EXAMPLE_STAFF && process.env.NODE_ENV === "production") {
  console.warn("[db] STAFF_JSON not set and data/staff.json missing — using example staff; real users can't sign in.");
}

// Accounts that must always be able to sign in, even when the staff directory
// isn't deployed (e.g. production). Only work email addresses — no personal data.
const BUILT_IN_STAFF: StaffRow[] = [
  {
    name: "케이디",
    title: "주임",
    email: "kaydee@vision119.com",
    aliases: ["kaydee21@v119n.onmicrosoft.com"],
    ext: "",
    role: "admin",
    teamId: "management",
  },
];

for (const b of BUILT_IN_STAFF) {
  if (!rows.some((r) => r.email?.toLowerCase() === b.email)) rows.push(b);
}

const users: User[] = rows
  .filter((r) => r.email)
  .map((r) => ({
    ...r,
    id: `u-${r.email.split("@")[0].toLowerCase()}`,
    email: r.email.toLowerCase(),
    aliases: r.aliases?.map((a) => a.toLowerCase()),
  }));

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

const products: Product[] = [];

const contacts: Contact[] = [];
const sentMails: SentMail[] = [];

let seq = 0;

const today = () => new Date().toISOString().slice(0, 10);

export const db = {
  users: {
    all: () => users,
    byId: (id: string) => users.find((u) => u.id === id),
    byEmail: (email: string) => {
      const e = email.toLowerCase();
      return users.find((u) => u.email === e || u.aliases?.includes(e));
    },
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
      items.unshift({ ...data, id: `i-new-${++seq}`, createdAt: today() });
    },
    remove: (id: string) => {
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) items.splice(idx, 1);
    },
  },
  products: {
    all: () => products,
    byCode: (code: string) => products.find((p) => p.code.toLowerCase() === code.toLowerCase()),
    create: (data: Omit<Product, "id" | "createdAt">) => {
      products.unshift({ ...data, id: `p-${++seq}`, createdAt: today() });
    },
    update: (id: string, patch: Partial<Pick<Product, "status">>) => {
      const p = products.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
    },
    remove: (id: string) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx >= 0) products.splice(idx, 1);
    },
  },
  contacts: {
    byId: (id: string) => contacts.find((c) => c.id === id),
    inTeam: (teamId: string) => contacts.filter((c) => c.teamId === teamId),
    create: (data: Omit<Contact, "id" | "createdAt">) => {
      contacts.unshift({ ...data, id: `c-${++seq}`, createdAt: today() });
    },
    remove: (id: string) => {
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx >= 0) contacts.splice(idx, 1);
    },
  },
  sentMails: {
    inTeam: (teamId: string) => sentMails.filter((m) => m.teamId === teamId),
    log: (data: Omit<SentMail, "id" | "sentAt">) => {
      sentMails.unshift({ ...data, id: `m-${++seq}`, sentAt: new Date().toISOString() });
    },
  },
};
