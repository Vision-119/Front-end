import type { Role, Team, User } from "../types";

export const COMPANY_NAME = "(주)비전정보통신";

// 회사 조직도. 영업본부 is a division: its head (본부장) sits on the division itself,
// everyone else in one of its sub-teams.
export const ORG: Team[] = [
  { id: "executive", name: "임원실" },
  { id: "management", name: "경영지원팀" },
  { id: "sales", name: "영업본부" },
  { id: "tech-sales", name: "기술영업팀", parentId: "sales" },
  { id: "sales-planning", name: "영업기획팀", parentId: "sales" },
  { id: "pr", name: "홍보팀", parentId: "sales" },
  { id: "production", name: "생산팀" },
  { id: "rnd", name: "기업부설연구소" },
];

export const getTeam = (id: string | null | undefined) => ORG.find((t) => t.id === id);

export const childTeams = (parentId?: string) => ORG.filter((t) => t.parentId === parentId);

/** Teams that have their own team page (leaf nodes of the org chart). */
export const MEMBER_TEAMS = ORG.filter((t) => !ORG.some((c) => c.parentId === t.id));

export const teamPath = (id: string | null) => {
  const team = getTeam(id);
  if (!team) return "";
  const parent = getTeam(team.parentId);
  return parent ? `${parent.name} › ${team.name}` : team.name;
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "관리자",
  leader: "팀장",
  member: "팀원",
};

// 직급 seniority, highest first. Unknown titles sort last.
const TITLE_RANK = ["대표이사", "전무", "상무", "이사", "고문", "본부장", "부장", "차장", "과장", "대리", "주임", "사원"];

const rank = (title: string) => {
  const i = TITLE_RANK.indexOf(title);
  return i < 0 ? TITLE_RANK.length : i;
};

export const bySeniority = (a: User, b: User) => rank(a.title) - rank(b.title) || a.name.localeCompare(b.name, "ko");

/** Shown with the "M" badge in the org chart: team leaders and the top of the company. */
export const isHead = (u: User) => u.role === "leader" || (!u.teamId && rank(u.title) === 0);
