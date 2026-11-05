import type { Item, User } from "../types";
import { MEMBER_TEAMS } from "./org";

// Single source of truth for who can do what. Every page and action checks here.
//
//            | Can see        | Can manage
// admin      | every team     | everything + users/teams/settings
// leader     | own team       | every item in own team
// member     | own team       | own items only

export const isAdmin = (user: User) => user.role === "admin";

export const canViewTeam = (user: User, teamId: string) => isAdmin(user) || user.teamId === teamId;

export const visibleTeams = (user: User) => MEMBER_TEAMS.filter((t) => canViewTeam(user, t.id));

export const canCreateItem = (user: User, teamId: string) => canViewTeam(user, teamId);

export const canManageItem = (user: User, item: Item) =>
  isAdmin(user) ||
  item.ownerId === user.id ||
  (user.role === "leader" && user.teamId === item.teamId);

export const canManageOrg = isAdmin;
