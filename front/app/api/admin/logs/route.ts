import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("password");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
  }

  const raw = await redis.lrange(`log:${date}`, 0, -1);
  const logs = raw.map((item) =>
    typeof item === "string" ? JSON.parse(item) : item
  );

  return new NextResponse(JSON.stringify(logs, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="worktalk-log-${date}.json"`,
    },
  });
}
