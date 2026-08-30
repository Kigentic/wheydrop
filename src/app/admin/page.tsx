import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLogin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.is_admin) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
