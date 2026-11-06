import type { User } from "../types";
import { db } from "./db";
import { bySeniority, childTeams, COMPANY_NAME, getTeam, isHead } from "./org";

// Plain, serializable tree for the client-side <OrgChart />.

export type OrgPerson = {
  id: string;
  name: string;
  title: string;
  ext: string;
  email: string;
  team: string;
  head: boolean;
};

export type OrgNode = {
  id: string;
  name: string;
  /** Everyone in this node and below. */
  count: number;
  people: OrgPerson[];
  children: OrgNode[];
};

const toPerson = (u: User): OrgPerson => ({
  id: u.id,
  name: u.name,
  title: u.title,
  ext: u.ext,
  email: u.email,
  team: getTeam(u.teamId)?.name ?? COMPANY_NAME,
  head: isHead(u),
});

function buildNode(id: string, name: string, staff: User[]): OrgNode {
  const people = staff.filter((u) => (u.teamId ?? "") === id).sort(bySeniority).map(toPerson);
  const children = childTeams(id || undefined).map((t) => buildNode(t.id, t.name, staff));
  return { id, name, people, children, count: people.length + children.reduce((n, c) => n + c.count, 0) };
}

export function buildOrgChart(): OrgNode {
  const staff = db.users.all().filter((u) => !u.system);
  return buildNode("", COMPANY_NAME, staff);
}
