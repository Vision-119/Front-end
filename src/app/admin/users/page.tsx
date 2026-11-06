import type { Metadata } from "next";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../../components/AppHeader";
import { requireUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { ORG, ROLE_LABEL, teamPath } from "../../../lib/org";
import { canManageOrg } from "../../../lib/permissions";
import type { Role } from "../../../types";
import { updateUser } from "../actions";

export const metadata: Metadata = { title: "사용자 관리 | Vision119" };

const selectClass = "h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

async function UsersContent() {
  const actor = await requireUser();
  if (!canManageOrg(actor)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
      <p className="mt-1 text-zinc-500">사용자 권한과 소속 팀을 관리합니다.</p>

      <section className={`${cardClass} mt-8 overflow-x-auto`}>
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="pb-2 font-medium">이름</th>
              <th className="pb-2 font-medium">권한</th>
              <th className="pb-2 font-medium">소속</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {db.users.all().map((u) => {
              const formId = `user-${u.id}`;
              const isSelf = u.id === actor.id;
              return (
                <tr key={u.id}>
                  <td className="py-2 pr-3">
                    <p className="font-medium">
                      {u.name} <span className="font-normal text-zinc-500">{u.title}</span>
                    </p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </td>
                  <td className="py-2 pr-3">
                    <select form={formId} name="role" defaultValue={u.role} className={selectClass} disabled={isSelf}>
                      {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                        <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                      ))}
                    </select>
                    {isSelf && <input type="hidden" form={formId} name="role" value={u.role} />}
                  </td>
                  <td className="py-2 pr-3">
                    <select form={formId} name="teamId" defaultValue={u.teamId ?? ""} className={selectClass}>
                      <option value="">— 없음</option>
                      {ORG.map((t) => (
                        <option key={t.id} value={t.id}>{teamPath(t.id)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    <form id={formId} action={updateUser.bind(null, u.id)}>
                      <button type="submit" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                        저장
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <UsersContent />
    </Suspense>
  );
}
