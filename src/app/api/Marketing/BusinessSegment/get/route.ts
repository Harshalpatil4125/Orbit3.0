import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized:token missing" },
        { status: 401 }
      );
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Marketing/BusinessSegment/get`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ success: false, message: errorData.message || "Failed to fetch" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        error: error,
      },
      { status: error.status || 500 }
    );
  }
}
