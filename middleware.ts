import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REALM = "Studio Mingdu Admin";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // admin 경로만 보호
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    const auth = req.headers.get("authorization");
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;

    if (!user || !pass) {
        return new NextResponse("Auth not configured", {
            status: 500,
        });
    }

    // 인증 헤더 없음 → 로그인 팝업
    if (!auth || !auth.startsWith("Basic ")) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": `Basic realm="${REALM}"`,
            },
        });
    }

    const base64 = auth.split(" ")[1];
    const [inputUser, inputPass] = Buffer.from(base64, "base64")
        .toString()
        .split(":");

    // 인증 실패 → 다시 팝업
    if (inputUser !== user || inputPass !== pass) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": `Basic realm="${REALM}"`,
            },
        });
    }

    // 인증 성공
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
