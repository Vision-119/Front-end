"use server";

import { refresh } from "next/cache";
import { requireUser } from "../../../../../../lib/auth";
import { db } from "../../../../../../lib/db";
import { mailErrorMessage, sendMail } from "../../../../../../lib/mailer";
import { canViewTeam } from "../../../../../../lib/permissions";

const TEAM_ID = "pr";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (f: FormData, name: string, max = 200) => String(f.get(name) ?? "").trim().slice(0, max);

async function requirePrUser() {
  const user = await requireUser();
  return canViewTeam(user, TEAM_ID) ? user : null;
}

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

export async function sendEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requirePrUser();
  if (!user) return { error: "권한이 없습니다." };

  const to = field(formData, "to");
  const subject = field(formData, "subject", 300);
  const text = field(formData, "body", 20000);

  if (!EMAIL_RE.test(to)) return { error: "받는 사람 이메일 주소를 확인하세요." };
  if (!subject) return { error: "제목을 입력하세요." };
  if (!text) return { error: "내용을 입력하세요." };

  try {
    await sendMail({ fromName: `${user.name} (비전정보통신)`, to, replyTo: user.email, subject, text });
    db.sentMails.log({ teamId: TEAM_ID, senderId: user.id, to, subject, status: "sent" });
    refresh();
    return { ok: true, message: `${to} 으로 메일을 보냈습니다.` };
  } catch (err) {
    console.error("[mail]", err);
    const error = mailErrorMessage(err);
    db.sentMails.log({ teamId: TEAM_ID, senderId: user.id, to, subject, status: "failed", error });
    refresh();
    return { error };
  }
}

export async function addContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requirePrUser();
  if (!user) return { error: "권한이 없습니다." };

  const name = field(formData, "name", 50);
  const email = field(formData, "email");
  if (!name) return { error: "이름을 입력하세요." };
  if (email && !EMAIL_RE.test(email)) return { error: "이메일 주소 형식이 올바르지 않습니다." };

  db.contacts.create({
    teamId: TEAM_ID,
    name,
    email,
    company: field(formData, "company", 100),
    title: field(formData, "title", 50),
    phone: field(formData, "phone", 50),
    memo: field(formData, "memo", 500),
  });
  refresh();
  return { ok: true };
}

export async function deleteContact(id: string) {
  const user = await requirePrUser();
  const contact = db.contacts.byId(id);
  if (!user || !contact || contact.teamId !== TEAM_ID) return;
  db.contacts.remove(id);
  refresh();
}
