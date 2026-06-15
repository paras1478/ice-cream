import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/revenue-report`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch revenue" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin revenue error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
