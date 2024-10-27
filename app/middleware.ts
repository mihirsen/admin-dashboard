// app/middleware.ts

import { NextResponse } from "next/server";

export function middleware(req: { cookies: { get: (arg0: string) => any } }) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
