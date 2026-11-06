export type Role = "admin" | "leader" | "member";

export type Team = {
  id: string;
  name: string;
  parentId?: string;
};

export type User = {
  id: string;
  name: string;
  /** 직급, e.g. 차장 */
  title: string;
  /** 내선번호 */
  ext: string;
  email: string;
  role: Role;
  /** null for admins who sit above the org chart (e.g. 대표님). */
  teamId: string | null;
  /** Technical account (e.g. 시스템 관리자) — hidden from the org chart. */
  system?: boolean;
};

export type Item = {
  id: string;
  teamId: string;
  ownerId: string;
  title: string;
  createdAt: string;
};
