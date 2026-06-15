import { auth } from "@/auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("Not authenticated");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.user.accessToken}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
