import { NextRequest, NextResponse } from "next/server";
import { getMaterialsStatement, updateMaterialsStatement } from "@/lib/materialStore";

export async function GET() {
  const content = await getMaterialsStatement();
  return NextResponse.json({ content });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.statement !== "string") {
    return NextResponse.json({ error: "A statement string is required." }, { status: 400 });
  }

  const content = await updateMaterialsStatement(body.statement.trim());
  return NextResponse.json({ content });
}
