import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch("http://127.0.0.1:8000/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  return NextResponse.json(data);
}
