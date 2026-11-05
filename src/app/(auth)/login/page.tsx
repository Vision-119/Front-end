import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = { title: "로그인 | Vision119" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Image src="/logo_black.svg" alt="Vision119" width={160} height={32} priority className="mx-auto h-8 w-auto dark:hidden" />
        <Image src="/logo_white.svg" alt="Vision119" width={160} height={32} priority className="mx-auto hidden h-8 w-auto dark:block" />
        <p className="mt-4 mb-8 text-center text-sm text-zinc-500">포털에 로그인하세요</p>
        <LoginForm />
        <details className="mt-6 text-xs text-zinc-500">
          <summary className="cursor-pointer">데모 계정 (비밀번호 1234)</summary>
          <ul className="mt-2 space-y-1 font-mono">
            <li>admin@vision119.com — 관리자</li>
            <li>ceo@ · kd@ · choi@vision119.com — 관리자</li>
            <li>tech-sales.leader@vision119.com — 팀장</li>
            <li>tech-sales.member@vision119.com — 팀원</li>
          </ul>
        </details>
      </div>
    </main>
  );
}
