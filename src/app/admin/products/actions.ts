"use server";

import { refresh } from "next/cache";
import { requireUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { canManageOrg } from "../../../lib/permissions";
import type { ProductStatus } from "../../../types";

export type ProductFormState = { error?: string; ok?: boolean } | undefined;

const STATUSES: ProductStatus[] = ["판매중", "단종"];

async function requireAdmin() {
  const user = await requireUser();
  if (!canManageOrg(user)) throw new Error("관리자만 제품을 관리할 수 있습니다.");
}

export async function addProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!name || !code) return { error: "제품명과 제품코드를 입력해 주세요." };
  if (db.products.byCode(code)) return { error: `제품코드 ${code}는 이미 등록되어 있습니다.` };

  db.products.create({ name, code, category, status: "판매중" });
  refresh();
  return { ok: true };
}

export async function setProductStatus(id: string, status: ProductStatus) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  db.products.update(id, { status });
  refresh();
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  db.products.remove(id);
  refresh();
}
