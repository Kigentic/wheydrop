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
      className="rounded-full border-2 border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-yellow-400"
    >
      Logout
    </button>
  );
}
