import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Drop, Variant } from "@/lib/types";
import { DropView } from "./DropView";

export const revalidate = 0;

export default async function DropPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: drop }, { data: variants }] = await Promise.all([
    supabase.from("drops").select("*").eq("id", id).single(),
    supabase.from("variants").select("*").eq("drop_id", id),
  ]);

  if (!drop) notFound();

  return (
    <DropView drop={drop as Drop} initialVariants={(variants ?? []) as Variant[]} />
  );
}
