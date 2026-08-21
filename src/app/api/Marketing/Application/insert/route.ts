import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("authToken");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = tokenCookie.value;
    const body = await req.json();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Marketing/Application/insert`;
    console.log("Fetching URL:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ success: false, message: errorData.message || "Failed to insert" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
