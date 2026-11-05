import type { Metadata } from "next";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../components/AppHeader";
import { requireUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { childTeams, MEMBER_TEAMS, ROLE_LABEL } from "../../lib/org";
import { canManageOrg } from "../../lib/permissions";
import type { Role } from "../../types";
import { updateUser } from "./actions";

export const metadata: Metadata = { title: "관리자 | Vision119" };

const selectClass =
  "h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

function OrgTree({ parentId }: { parentId?: string }) {
  const teams = childTeams(parentId);
  if (teams.length === 0) return null;
  return (
    <ul className={parentId ? "ml-4 border-l border-zinc-200 pl-3 dark:border-zinc-800" : ""}>
      {teams.map((t) => (
        <li key={t.id} className="py-1">
          <span className="text-sm">{t.name}</span>
          {MEMBER_TEAMS.includes(t) && (
            <span className="ml-2 text-xs text-zinc-500">{db.users.inTeam(t.id).length}명</span>
          )}
          <OrgTree parentId={t.id} />
        </li>
      ))}
    </ul>
  );
}

async function AdminContent() {
  const actor = await requireUser();
  if (!canManageOrg(actor)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">관리자</h1>
      <p className="mt-1 text-zinc-500">사용자 권한과 소속 팀을 관리합니다.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <section className={`${cardClass} overflow-x-auto`}>
          <h2 className="font-semibold">사용자</h2>
          <table className="mt-4 w-full min-w-[560px] text-sm">
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
                return (
                  <tr key={u.id}>
                    <td className="py-2 pr-3">
                      <p className="font-medium">
                        {u.name} <span className="font-normal text-zinc-500">{u.title}</span>
                      </p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </td>
                    <td className="py-2 pr-3">
                      <select form={formId} name="role" defaultValue={u.role} className={selectClass} disabled={u.id === actor.id}>
                        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                        ))}
                      </select>
                      {u.id === actor.id && <input type="hidden" form={formId} name="role" value={u.role} />}
                    </td>
                    <td className="py-2 pr-3">
                      <select form={formId} name="teamId" defaultValue={u.teamId ?? ""} className={selectClass}>
                        <option value="">— 없음 (관리자 전용)</option>
                        {MEMBER_TEAMS.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
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

        <aside className={cardClass}>
          <h2 className="font-semibold">조직도</h2>
          <div className="mt-3">
            <OrgTree />
          </div>
        </aside>
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <AdminContent />
    </Suspense>
  );
}
