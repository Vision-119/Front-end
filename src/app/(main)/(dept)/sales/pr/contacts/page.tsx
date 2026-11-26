import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "../../../../../../lib/db";
import { smtpConfigured, smtpSender } from "../../../../../../lib/mailer";
import { requireUser } from "../../../../../../lib/auth";
import MailAndContacts from "./MailAndContacts";

export const metadata: Metadata = { title: "이메일·담당자 | 홍보팀" };

// /sales/pr/contacts — 홍보팀 이메일 발송 + 외부 담당자 목록. Access is checked by ../layout.tsx.
async function Content() {
  const user = await requireUser();
  const contacts = db.contacts.inTeam("pr");
  const sent = db.sentMails.inTeam("pr").map((m) => ({
    ...m,
    senderName: db.users.byId(m.senderId)?.name ?? "알 수 없음",
  }));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">이메일 · 담당자</h1>
      <p className="mt-1 text-zinc-500">홍보팀 외부 담당자를 관리하고 메일을 보냅니다.</p>
      <MailAndContacts
        contacts={contacts}
        sent={sent}
        smtpConfigured={smtpConfigured}
        sender={smtpSender}
        replyTo={user.email}
      />
    </>
  );
}

export default function PrContactsPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <Content />
    </Suspense>
  );
}
