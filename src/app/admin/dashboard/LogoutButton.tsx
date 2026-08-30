"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium hover:border-zinc-500"
    >
      Logout
    </button>
  );
}
