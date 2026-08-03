//Nome proxy devido ao novo uso no next.js 16
import { jwtVerify, type JWTPayload } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

export interface UserPayload extends JWTPayload {
    id: string;
    name: string;
    email: string;
    role: "client" | "admin" | "manager";
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as UserPayload;
    } catch (error) {
        return null;
    }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/products", "/profile", "/admin", "/review"];
const ADMIN_ONLY_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"]; // rotas que usuário logado não deveria acessar

export async function proxy(req: NextRequest) {

    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    const payload = token ? await verifyToken(token) : null;
    const isAuthenticated = !!payload;

    // Usuário não autenticado tentando acessar rota protegida
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname); // volta pra cá após login
        return NextResponse.redirect(loginUrl);
    }

    // Usuário autenticado tentando acessar /login ou /register
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Rota de admin, mas usuário não é admin
    if (isAdminRoute && payload?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/products/:path*",
        "/profile/:path*",
        "/admin/:path*",
        "/login",
        "/register",
    ],
};