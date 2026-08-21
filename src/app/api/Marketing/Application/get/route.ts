// Import Next.js Request and Response classes.
// NextRequest -> Represents the incoming HTTP request.
// NextResponse -> Used to send a response back to the client.
import { NextRequest, NextResponse } from "next/server";

// Import cookies() to access cookies stored in the user's browser.
import { cookies } from "next/headers";

/**
 * Handles GET requests to:
 * /api/Marketing/Application/get
 * Whenever the frontend calls:
 * fetch("/api/Marketing/Application/get")
 * this function executes.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("authToken");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = tokenCookie.value;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Marketing/Application/get`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ success: false, message: errorData.message || "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
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
