import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Gavel } from "lucide-react";
import { RequestThread } from "@/components/request-thread";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getService, inr, requestStatuses, statusLabel } from "@/lib/services";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "My Dashboard | ZameenDhan" }, { name: "description", content: "Track your service requests, bids and auction deposits." },
    { property: "og:title", content: "My Dashboard | ZameenDhan" }, { property: "og:description", content: "Track your requests and bids." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"requests" | "auctions">("requests");
  const [open, setOpen] = useState<string | null>(null);
  const { data: requests = [] } = useQuery({ queryKey: ["my-requests", user?.id], enabled: !!user, queryFn: async () => (await supabase.from("service_requests").select("*").eq("user_id", user!.id).order("created_at", { ascending: false })).data ?? [] });
  const { data: regs = [] } = useQuery({ queryKey: ["my-regs", user?.id], enabled: !!user, queryFn: async () => (await supabase.from("auction_registrations").select("*, auctions(id, title, current_price, current_winner, ends_at)").eq("user_id", user!.id)).data ?? [] });

  return <section className="dashboard-page content-width">
    <div className="dashboard-head"><div><p className="eyebrow">MY ACCOUNT</p><h1>Welcome{user?.user_metadata?.["full_name"] ? `, ${user.user_metadata["full_name"]}` : ""}</h1><p>{user?.email}</p></div><Button asChild size="lg"><Link to="/services/$category" params={{ category: "transaction" }}>Book a service</Link></Button></div>
    <div className="dashboard-tabs" role="tablist">
      <Button variant={tab === "requests" ? "default" : "outline"} onClick={() => setTab("requests")}><ClipboardList size={16}/>My requests ({requests.length})</Button>
      <Button variant={tab === "auctions" ? "default" : "outline"} onClick={() => setTab("auctions")}><Gavel size={16}/>Bids & deposits ({regs.length})</Button>
    </div>
    {tab === "requests" && (requests.length ? <div className="dashboard-list">{requests.map((r) => {
      const step = requestStatuses.indexOf(r.status as typeof requestStatuses[number]);
      return <div key={r.id} className="dashboard-row request-row"><div className="request-top"><div><h3>#{r.ref_no} · {getService(r.service_slug)?.name ?? r.service_slug}</h3><p>{inr(r.fee)} · {r.paid ? "Paid" : "Payment pending — our team will share a payment link"}</p></div><Button variant="outline" size="sm" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? "Hide" : "Messages"}</Button></div>
        <ol className="timeline">{requestStatuses.map((s, i) => <li key={s} className={i <= step ? "done" : ""}>{statusLabel[s]}</li>)}</ol>
        {open === r.id && <RequestThread requestId={r.id} asTeam={false}/>}</div>; })}</div>
      : <div className="empty-state"><h2>No requests yet</h2><p>Book your first property service.</p><Link to="/services/$category" params={{ category: "transaction" }}>Browse services</Link></div>)}
    {tab === "auctions" && (regs.length ? <div className="dashboard-list">{regs.map((g) => { const a = g.auctions; return <div key={g.auction_id} className="dashboard-row"><div><h3>{a?.title}</h3><p>EMD: {g.emd_status.replace("_", " ")} · Current bid {inr(a?.current_price ?? 0)} {a?.current_winner === user?.id ? "· You are leading" : ""}</p></div><Button asChild variant="outline" size="sm"><Link to="/auctions/$id" params={{ id: g.auction_id }}>Open</Link></Button></div>; })}</div>
      : <div className="empty-state"><h2>No auctions joined</h2><Link to="/auctions">See auctions</Link></div>)}
  </section>;
}
