import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/upload/images`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to upload images" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
