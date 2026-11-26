import type { Metadata } from "next";
import { cardClass } from "../../../../../../components/AppHeader";
import { smtpConfigured, smtpSender } from "../../../../../../lib/mailer";
import { MailForm } from "./MailForm";

export const metadata: Metadata = { title: "메일 발송 | 홍보팀" };

// /sales/pr/mail — 홍보팀: send an email to a contact person (담당자) via the company SMTP account.
export default function PrMailPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">메일 발송</h1>
      <p className="mt-1 text-zinc-500">담당자에게 회사 메일 계정으로 메일을 보냅니다.</p>

      <section className={`${cardClass} mt-8 max-w-2xl`}>
        {smtpConfigured ? (
          <MailForm from={smtpSender} />
        ) : (
          <p className="text-sm text-zinc-500">
            SMTP가 아직 설정되지 않았습니다. <code>.env.local</code>에 <code>SMTP_HOST</code>, <code>SMTP_USER</code>,{" "}
            <code>SMTP_PASS</code>를 입력하고 서버를 다시 시작하세요.
          </p>
        )}
      </section>
    </>
  );
}
