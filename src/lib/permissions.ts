import type { Item, User } from "../types";
import { childTeams, getTeam } from "./org";

// Single source of truth for who can do what. Every page and action checks here.
//
//            | Can see                         | Can manage
// admin      | every team                      | everything + users/teams/settings
// leader     | own team (본부장: its sub-teams) | every item in those teams
// member     | own team                        | own items only

export const isAdmin = (user: User) => user.role === "admin";

/** The user's own team, or — for a division head like 영업본부장 — one of its sub-teams. */
export const inOwnScope = (user: User, teamId: string) =>
  !!user.teamId && (user.teamId === teamId || getTeam(teamId)?.parentId === user.teamId);

/** Team pages shown in 내 업무 mode. */
export const workTeams = (user: User) => {
  const team = getTeam(user.teamId);
  if (!team) return [];
  const subs = childTeams(team.id);
  return subs.length ? subs : [team];
};

export const canViewTeam = (user: User, teamId: string) => isAdmin(user) || inOwnScope(user, teamId);

export const canCreateItem = (user: User, teamId: string) => canViewTeam(user, teamId);

export const canManageItem = (user: User, item: Item) =>
  isAdmin(user) || item.ownerId === user.id || (user.role === "leader" && inOwnScope(user, item.teamId));

export const canManageOrg = isAdmin;
