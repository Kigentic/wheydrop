export const ADMIN_COOKIE = "admin_session";

export async function adminToken() {
  const data = new TextEncoder().encode(process.env.ADMIN_PASSWORD ?? "");
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
