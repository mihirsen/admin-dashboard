import fs from "fs";
import path from "path";

const filePath = path.resolve("mock-data/users.json");

interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  photo: string;
}

export function getUsers(): User[] {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data) as User[];
}

export function addUser(newUser: User): void {
  const users = getUsers();
  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function deleteUser(userId: number): void {
  let users = getUsers();
  users = users.filter((user) => user.id !== userId);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
