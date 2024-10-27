// utils/auth.ts
import users from "../mock-data/users.json";

interface User {
  email: string;
  password: string;
}

const SESSION_KEY = "userSession";

export const verifyUser = (email: string, password: string): boolean => {
  // Find the user in the mock data
  const user: User | undefined = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    // If user is valid, save the user session
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return true;
  }
  return false; // Return false if user is invalid
};

export const getUserSession = (): User | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  return sessionData ? JSON.parse(sessionData) : null; // Return parsed user session or null if not found
};

export const clearUserSession = (): void => {
  localStorage.removeItem(SESSION_KEY); // Clear user session from local storage
};
