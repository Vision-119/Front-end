import nodemailer, { type Transporter } from "nodemailer";

// Outgoing mail via the company mail server (다우오피스, vision119.com MX = mx1.daouoffice.com).
// Configure in .env.local:
//   SMTP_HOST=smtp.daouoffice.com  SMTP_PORT=465
//   SMTP_USER=<sending account, e.g. kaydee@vision119.com>  SMTP_PASS=<that account's password>
// All portal mail is sent from SMTP_USER; replies go to the signed-in user (Reply-To).

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT ?? 465);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

export const smtpConfigured = Boolean(HOST && USER && PASS);
export const smtpSender = USER ?? "";

let transporter: Transporter | null = null;

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: PORT === 465, // 465 = SSL; 587 = STARTTLS
    auth: { user: USER, pass: PASS },
  });
  return transporter;
}

export async function sendMail(opts: { fromName: string; to: string; replyTo?: string; subject: string; text: string }) {
  if (!smtpConfigured) throw new Error("SMTP is not configured");
  await getTransporter().sendMail({
    from: { name: opts.fromName, address: USER! },
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  });
}

/** Turns nodemailer errors into a short Korean message for the UI. */
export function mailErrorMessage(err: unknown) {
  const e = err as { code?: string; responseCode?: number; message?: string };
  if (e.code === "EAUTH" || e.responseCode === 535) return "SMTP 로그인 실패: 계정·비밀번호 또는 다우오피스 외부 메일(SMTP) 허용 설정을 확인하세요.";
  if (e.code === "ECONNECTION" || e.code === "ETIMEDOUT" || e.code === "ESOCKET" || e.code === "EDNS")
    return "메일 서버에 연결하지 못했습니다. SMTP_HOST/SMTP_PORT 또는 사내 방화벽을 확인하세요.";
  if (e.responseCode && e.responseCode >= 500) return `메일 서버가 거부했습니다 (${e.responseCode}).`;
  return "메일 발송에 실패했습니다.";
}
