"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Contact, SentMail } from "../../../../../../types";
import { addContact, deleteContact, sendEmail } from "./actions";

// Same as cardClass in components/AppHeader (not imported: that module is server-only).
const cardClass = "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";
const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900";
const buttonClass =
  "h-10 shrink-0 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60";

type Props = {
  contacts: Contact[];
  sent: (SentMail & { senderName: string })[];
  smtpConfigured: boolean;
  sender: string;
  replyTo: string;
};

export default function MailAndContacts({ contacts, sent, smtpConfigured, sender, replyTo }: Props) {
  const [to, setTo] = useState("");
  const toRef = useRef<HTMLInputElement>(null);

  const writeTo = (email: string) => {
    setTo(email);
    toRef.current?.focus();
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="grid content-start gap-6">
        <Compose to={to} setTo={setTo} toRef={toRef} smtpConfigured={smtpConfigured} sender={sender} replyTo={replyTo} />
        <SentLog sent={sent} />
      </div>
      <Contacts contacts={contacts} onWrite={writeTo} />
    </div>
  );
}

function Compose({
  to,
  setTo,
  toRef,
  smtpConfigured,
  sender,
  replyTo,
}: {
  to: string;
  setTo: (v: string) => void;
  toRef: React.RefObject<HTMLInputElement | null>;
  smtpConfigured: boolean;
  sender: string;
  replyTo: string;
}) {
  const [state, action, pending] = useActionState(sendEmail, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setTo("");
    }
  }, [state, setTo]);

  return (
    <section className={cardClass}>
      <h2 className="font-semibold">메일 보내기</h2>
      {smtpConfigured ? (
        <p className="mt-1 text-xs text-zinc-500">
          보내는 계정 {sender} · 답장은 {replyTo} 로 받습니다
        </p>
      ) : (
        <p role="alert" className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          메일 서버가 설정되지 않았습니다. .env.local 에 SMTP_HOST · SMTP_USER · SMTP_PASS 를 입력하고 서버를 재시작하세요.
        </p>
      )}

      <form ref={formRef} action={action} className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm font-medium">
          받는 사람
          <input
            ref={toRef}
            name="to"
            type="email"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="name@example.com"
            className={inputClass}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          제목
          <input name="subject" required maxLength={300} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          내용
          <textarea
            name="body"
            required
            rows={8}
            className="min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <div className="flex items-center justify-between gap-3">
          <p role="status" className={`text-sm ${state?.error ? "text-red-600" : "text-green-700 dark:text-green-400"}`}>
            {state?.error ?? state?.message}
          </p>
          <button type="submit" disabled={pending || !smtpConfigured} className={buttonClass}>
            {pending ? "보내는 중…" : "보내기"}
          </button>
        </div>
      </form>
    </section>
  );
}

function SentLog({ sent }: { sent: (SentMail & { senderName: string })[] }) {
  return (
    <section className={cardClass}>
      <h2 className="font-semibold">보낸 메일</h2>
      <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
        {sent.map((m) => (
          <li key={m.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium">{m.subject}</p>
              <p className="truncate text-xs text-zinc-500">
                {m.to} · {m.senderName} · {m.sentAt.slice(0, 16).replace("T", " ")}
              </p>
              {m.error && <p className="text-xs text-red-600">{m.error}</p>}
            </div>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                m.status === "sent"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
              }`}
            >
              {m.status === "sent" ? "발송" : "실패"}
            </span>
          </li>
        ))}
        {sent.length === 0 && <li className="py-2.5 text-sm text-zinc-500">보낸 메일이 없습니다.</li>}
      </ul>
    </section>
  );
}

function Contacts({ contacts, onWrite }: { contacts: Contact[]; onWrite: (email: string) => void }) {
  const [state, action, pending] = useActionState(addContact, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <aside className={`${cardClass} self-start`}>
      <h2 className="font-semibold">담당자</h2>

      <form ref={formRef} action={action} className="mt-4 grid grid-cols-2 gap-2">
        <input name="name" required placeholder="이름 *" aria-label="이름" className={inputClass} />
        <input name="title" placeholder="직함" aria-label="직함" className={inputClass} />
        <input name="company" placeholder="소속 (기관·업체)" aria-label="소속" className={`${inputClass} col-span-2`} />
        <input name="email" type="email" placeholder="이메일" aria-label="이메일" className={`${inputClass} col-span-2`} />
        <input name="phone" placeholder="연락처" aria-label="연락처" className={inputClass} />
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "추가 중…" : "담당자 추가"}
        </button>
        <input name="memo" placeholder="메모" aria-label="메모" className={`${inputClass} col-span-2`} />
        {state?.error && (
          <p role="alert" className="col-span-2 text-sm text-red-600">
            {state.error}
          </p>
        )}
      </form>

      <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {contacts.map((c) => (
          <li key={c.id} className="py-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">
                  {c.name} {c.title && <span className="font-normal text-zinc-500">{c.title}</span>}
                </p>
                {c.company && <p className="text-xs text-zinc-500">{c.company}</p>}
              </div>
              <form action={deleteContact.bind(null, c.id)}>
                <button type="submit" className="text-xs text-zinc-500 hover:text-red-600">삭제</button>
              </form>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
              {c.email && (
                <button type="button" onClick={() => onWrite(c.email)} className="font-medium text-red-600 hover:underline">
                  ✉ {c.email}
                </button>
              )}
              {c.phone && <span>☎ {c.phone}</span>}
            </div>
            {c.memo && <p className="mt-1 text-xs text-zinc-500">{c.memo}</p>}
          </li>
        ))}
        {contacts.length === 0 && <li className="py-3 text-sm text-zinc-500">등록된 담당자가 없습니다.</li>}
      </ul>
    </aside>
  );
}
