"use client";

import { useActionState } from "react";
import { sendContactMail } from "./actions";

const inputClass =
  "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-normal outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 dark:border-zinc-700 dark:bg-zinc-900";

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={`flex flex-col gap-1.5 text-sm font-medium ${className}`}>{label}{children}</label>;
}

export function MailForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(sendContactMail, undefined);
  const v = state && !state.ok ? state.values : undefined;

  return (
    // key: clear the form after a successful send
    <form key={state?.ok ? state.message : "form"} action={action} className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500">
        보내는 사람: <span className="font-medium text-zinc-900 dark:text-zinc-100">{from}</span>
      </p>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold">담당자</legend>
        <Field label="담당자 이름 *">
          <input name="contactName" required defaultValue={v?.contactName} placeholder="홍길동 주무관" className={inputClass} />
        </Field>
        <Field label="소속 (기관·회사)">
          <input name="company" defaultValue={v?.company} placeholder="○○시청 안전총괄과" className={inputClass} />
        </Field>
        <Field label="이메일 *" className="sm:col-span-2">
          <input name="to" type="email" required defaultValue={v?.to} placeholder="name@example.com" className={inputClass} />
        </Field>
      </fieldset>

      <Field label="제목 *">
        <input name="subject" required defaultValue={v?.subject} className={inputClass} />
      </Field>
      <Field label="내용 *">
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={v?.body}
          className={`${inputClass} h-auto py-2 leading-relaxed`}
        />
      </Field>

      {state && (
        <p
          role={state.ok ? "status" : "alert"}
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-10 self-end rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "보내는 중…" : "메일 보내기"}
      </button>
    </form>
  );
}
