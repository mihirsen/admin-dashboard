// app/api/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Ensure you have bcrypt installed
import { v4 as uuidv4 } from "uuid";

let users: Array<{ id: string; email: string; password: string }> = [];

export async function POST(request: Request) {
  const { email, password, confirmPassword } = await request.json();

  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hashedPassword };

  // Save user to your database or in-memory array (for demonstration)
  users.push(user);

  return NextResponse.json(
    { message: "Successfully signed up!" },
    { status: 200 }
  );
}
