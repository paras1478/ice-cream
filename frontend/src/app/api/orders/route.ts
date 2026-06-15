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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch orders" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
