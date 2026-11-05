import type { Role, Team } from "../types";

// 회사 조직도. 영업본부 is a grouping; people belong to its sub-teams.
export const ORG: Team[] = [
  { id: "management", name: "경영지원팀" },
  { id: "sales", name: "영업본부" },
  { id: "tech-sales", name: "기술영업팀", parentId: "sales" },
  { id: "sales-planning", name: "영업기획팀", parentId: "sales" },
  { id: "pr", name: "홍보팀", parentId: "sales" },
  { id: "production", name: "생산팀" },
  { id: "rnd", name: "기업부설연구소" },
];

export const getTeam = (id: string | null) => ORG.find((t) => t.id === id);

export const childTeams = (parentId?: string) => ORG.filter((t) => t.parentId === parentId);

/** Teams people can belong to (leaf nodes of the org chart). */
export const MEMBER_TEAMS = ORG.filter((t) => !ORG.some((c) => c.parentId === t.id));

export const teamPath = (id: string | null) => {
  const team = getTeam(id);
  if (!team) return "";
  const parent = getTeam(team.parentId ?? null);
  return parent ? `${parent.name} › ${team.name}` : team.name;
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "관리자",
  leader: "팀장",
  member: "팀원",
};
