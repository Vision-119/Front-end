"use client";

import { useActionState, useEffect, useRef } from "react";
import { addProduct } from "./actions";

const inputClass =
  "h-10 min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900";

export default function ProductForm() {
  const [state, action, pending] = useActionState(addProduct, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action}>
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <input name="name" required placeholder="제품명" aria-label="제품명" className={inputClass} />
        <input name="code" required placeholder="제품코드" aria-label="제품코드" className={inputClass} />
        <input name="category" placeholder="분류 (선택)" aria-label="분류" className={inputClass} />
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "등록 중…" : "제품 등록"}
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
