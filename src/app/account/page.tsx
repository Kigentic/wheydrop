import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Drop, Order } from "@/lib/types";
import { LogoutButton } from "./LogoutButton";
import { ProfileForm } from "./ProfileForm";

export const revalidate = 0;

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders ?? []) as Order[];

  const dropIds = [...new Set(orderList.map((o) => o.drop_id))];
  const { data: drops } = dropIds.length
    ? await supabase.from("drops").select("id, title").in("id", dropIds)
    : { data: [] };
  const dropTitleMap = new Map(((drops ?? []) as Pick<Drop, "id" | "title">[]).map((d) => [d.id, d.title]));

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mein Konto</h1>
            <p className="text-zinc-600">{user.email}</p>
            <Link
              href="/account/change-password"
              className="mt-1 inline-block text-sm font-semibold hover:underline"
            >
              Passwort ändern
            </Link>
          </div>
          <LogoutButton />
        </div>

        <h2 className="mt-10 mb-1 text-lg font-bold">Meine Daten</h2>
        <p className="text-sm text-zinc-600">
          Diese Angaben werden bei der nächsten Bestellung automatisch vorausgefüllt.
        </p>
        <ProfileForm
          initial={{
            firstName:
              (user.user_metadata?.first_name as string | undefined) ??
              ((user.user_metadata?.name as string | undefined)?.split(" ")[0] || ""),
            lastName:
              (user.user_metadata?.last_name as string | undefined) ??
              ((user.user_metadata?.name as string | undefined)?.split(" ").slice(1).join(" ") || ""),
            street: (user.user_metadata?.street as string | undefined) ?? "",
            zip: (user.user_metadata?.zip as string | undefined) ?? "",
            city: (user.user_metadata?.city as string | undefined) ?? "",
            country: (user.user_metadata?.country as string | undefined) ?? "Deutschland",
          }}
        />

        <h2 className="mt-10 mb-3 text-lg font-bold">Meine Bestellungen</h2>

        <div className="space-y-3">
          {orderList.map((o) => (
            <div key={o.id} className="rounded-lg border-2 border-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{dropTitleMap.get(o.drop_id) ?? "Drop"}</div>
                  <div className="text-sm text-zinc-600">Menge: {o.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-yellow-400 px-2 py-0.5 text-xs font-bold uppercase">
                    {o.status}
                  </div>
                  <div className="mt-1 font-bold tabular-nums">
                    {o.final_amount != null
                      ? `${o.final_amount.toFixed(2)} €`
                      : `bis zu ${o.authorized_amount.toFixed(2)} €`}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orderList.length === 0 && (
            <p className="text-zinc-600">Du hast noch keine Bestellungen.</p>
          )}
        </div>
      </main>
    </div>
  );
}
