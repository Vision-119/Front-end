import type { Item, User } from "../types";
import { MEMBER_TEAMS } from "./org";

// In-memory demo store. Resets on server restart; replace with the backend API.

export const DEMO_PASSWORD = "1234";

const admins: User[] = [
  { id: "u-admin", name: "시스템 관리자", email: "admin@vision119.com", role: "admin", teamId: null },
  { id: "u-ceo", name: "대표님", email: "ceo@vision119.com", role: "admin", teamId: null },
  { id: "u-kd", name: "KD", email: "kd@vision119.com", role: "admin", teamId: "management" },
  { id: "u-choi", name: "최차장님", email: "choi@vision119.com", role: "admin", teamId: "rnd" },
];

const teamUsers: User[] = MEMBER_TEAMS.flatMap((t) => [
  { id: `u-${t.id}-leader`, name: `${t.name} 팀장`, email: `${t.id}.leader@vision119.com`, role: "leader", teamId: t.id },
  { id: `u-${t.id}-member`, name: `${t.name} 팀원`, email: `${t.id}.member@vision119.com`, role: "member", teamId: t.id },
]);

const users: User[] = [...admins, ...teamUsers];

const items: Item[] = MEMBER_TEAMS.flatMap((t, i) => [
  { id: `i-${t.id}-1`, teamId: t.id, ownerId: `u-${t.id}-leader`, title: `${t.name} 주간 회의록`, createdAt: `2026-11-0${(i % 4) + 1}` },
  { id: `i-${t.id}-2`, teamId: t.id, ownerId: `u-${t.id}-member`, title: `${t.name} 업무 보고`, createdAt: `2026-11-0${(i % 4) + 2}` },
]);

let seq = 0;

export const db = {
  users: {
    all: () => users,
    byId: (id: string) => users.find((u) => u.id === id),
    byEmail: (email: string) => users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
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
