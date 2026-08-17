import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const product = await db.importedProduct.findUnique({ where: { id: params.id } });
  if (!product || product.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.importedProduct.update({
    where: { id: params.id },
    data: { status: "PUBLISHED" },
  });

  return NextResponse.json({ product: updated });
}
