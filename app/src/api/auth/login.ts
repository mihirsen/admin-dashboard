// pages/api/login.js
import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (email === "test@example.com" && password === "password") {
      const token = sign({ email }, secretKey, { expiresIn: "1h" });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
