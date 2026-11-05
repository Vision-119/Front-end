export type Role = "admin" | "leader" | "member";

export type Team = {
  id: string;
  name: string;
  parentId?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** null for admins who sit above the org chart (e.g. 대표님). */
  teamId: string | null;
};

export type Item = {
  id: string;
  teamId: string;
  ownerId: string;
  title: string;
  createdAt: string;
};
