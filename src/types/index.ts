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
  /** Extra addresses that sign in as this user, e.g. a Microsoft account UPN (name@v119n.onmicrosoft.com). */
  aliases?: string[];
  role: Role;
  /** null for admins who sit above the org chart (e.g. 대표님). */
  teamId: string | null;
  /** Technical account (e.g. 시스템 관리자) — hidden from the org chart. */
  system?: boolean;
};

export type ProductStatus = "판매중" | "단종";

export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  status: ProductStatus;
  createdAt: string;
};

export type Item = {
  id: string;
  teamId: string;
  ownerId: string;
  title: string;
  createdAt: string;
};

/** 외부 담당자 (e.g. 지자체·발주처 contact) kept by a team. */
export type Contact = {
  id: string;
  teamId: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  memo: string;
  createdAt: string;
};

/** A mail sent from the portal (sent log). */
export type SentMail = {
  id: string;
  teamId: string;
  senderId: string;
  to: string;
  subject: string;
  sentAt: string;
  status: "sent" | "failed";
  error?: string;
};
