"use server";

import { requireUser } from "../../../../../../lib/auth";
import { mailErrorMessage, sendMail, smtpConfigured } from "../../../../../../lib/mailer";
import { canViewTeam } from "../../../../../../lib/permissions";

export type MailState =
  | { ok: true; message: string }
  | { ok: false; message: string; values?: Record<string, string> }
  | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMail(_prev: MailState, formData: FormData): Promise<MailState> {
  const user = await requireUser();
  if (!canViewTeam(user, "pr")) return { ok: false, message: "홍보팀 구성원만 메일을 보낼 수 있습니다." };

  const values = {
    contactName: String(formData.get("contactName") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    to: String(formData.get("to") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
  };

  if (!smtpConfigured) return { ok: false, message: "SMTP가 설정되지 않았습니다. .env.local의 SMTP_* 값을 확인하세요.", values };
  if (!values.contactName) return { ok: false, message: "담당자 이름을 입력하세요.", values };
  if (!EMAIL_RE.test(values.to)) return { ok: false, message: "받는 사람 이메일 주소가 올바르지 않습니다.", values };
  if (!values.subject || !values.body) return { ok: false, message: "제목과 내용을 입력하세요.", values };

  try {
    await sendMail({
      fromName: `비전정보통신 ${user.name}`,
      to: `"${values.contactName.replace(/"/g, "")}" <${values.to}>`,
      replyTo: user.email,
      subject: values.subject,
      text: values.body,
    });
  } catch (err) {
    console.error("[pr mail]", err);
    return { ok: false, message: mailErrorMessage(err), values };
  }

  const who = values.company ? `${values.company} ${values.contactName}` : values.contactName;
  return { ok: true, message: `${who} 님(${values.to})에게 메일을 보냈습니다.` };
}
