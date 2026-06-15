import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch categories" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
