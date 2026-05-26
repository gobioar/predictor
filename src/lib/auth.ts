import "server-only";

import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "gobio_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  active: true,
} satisfies Record<keyof CurrentUser, true>;

function getSessionSecret() {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.SESSION_SECRET ??
    process.env.DATABASE_URL ??
    (process.env.NODE_ENV === "production" ? undefined : "dev-gobio-session-secret");

  if (!secret) {
    throw new Error("Missing AUTH_SECRET or DATABASE_URL for session signing.");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: Pick<User, "id">) {
  const expires = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
    maxAge: SESSION_DURATION_SECONDS,
  });
}

async function readSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return typeof payload.userId === "number" ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await readSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user?.active) return null;
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
