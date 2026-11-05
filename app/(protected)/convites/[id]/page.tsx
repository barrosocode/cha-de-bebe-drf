import { redirect } from "next/navigation";
import { InviteForm } from "@/components/features/InviteForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "novo") redirect("/convites");
  return <InviteForm id={id} />;
}
