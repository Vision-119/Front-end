import type { Metadata } from "next";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../../components/AppHeader";
import { requireUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { canManageOrg } from "../../../lib/permissions";
import { deleteProduct, setProductStatus } from "./actions";
import ProductForm from "./ProductForm";

export const metadata: Metadata = { title: "제품 관리 | Vision119" };

async function ProductsContent() {
  const user = await requireUser();
  if (!canManageOrg(user)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  const products = db.products.all();
  const active = products.filter((p) => p.status === "판매중").length;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">제품 관리</h1>
      <p className="mt-1 text-zinc-500">
        등록 제품 {products.length}개 · 판매중 {active}개
      </p>

      <section className={`${cardClass} mt-8`}>
        <h2 className="mb-3 font-semibold">새 제품 등록</h2>
        <ProductForm />
      </section>

      <section className={`${cardClass} mt-6 overflow-x-auto`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="pb-2 font-medium">제품명</th>
              <th className="pb-2 font-medium">제품코드</th>
              <th className="pb-2 font-medium">분류</th>
              <th className="pb-2 font-medium">상태</th>
              <th className="pb-2 font-medium">등록일</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((p) => {
              const next = p.status === "판매중" ? "단종" : "판매중";
              return (
                <tr key={p.id}>
                  <td className="py-2.5 pr-3 font-medium">{p.name}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs">{p.code}</td>
                  <td className="py-2.5 pr-3 text-zinc-500">{p.category || "—"}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === "판매중"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-zinc-500">{p.createdAt}</td>
                  <td className="py-2.5 text-right whitespace-nowrap">
                    <form action={setProductStatus.bind(null, p.id, next)} className="inline">
                      <button type="submit" className="mr-3 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        {next}으로 변경
                      </button>
                    </form>
                    <form action={deleteProduct.bind(null, p.id)} className="inline">
                      <button type="submit" className="text-xs text-zinc-500 hover:text-red-600">삭제</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-zinc-500">
                  등록된 제품이 없습니다. 위에서 첫 제품을 등록해 주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <ProductsContent />
    </Suspense>
  );
}
