import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Gavel, Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export function RequestThread({ requestId, asTeam }: { requestId: string; asTeam: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");
  const { data = [] } = useQuery({ queryKey: ["updates", requestId], queryFn: async () => (await supabase.from("request_updates").select("*").eq("request_id", requestId).order("created_at")).data ?? [] });
  const openFile = async (path: string) => { const { data } = await supabase.storage.from("request-files").createSignedUrl(path, 300); if (data) window.open(data.signedUrl, "_blank"); };
  const send = async (file?: File) => {
    if (!user || (!msg.trim() && !file)) return;
    let file_path: string | null = null;
    if (file) { file_path = `${requestId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`; const up = await supabase.storage.from("request-files").upload(file_path, file); if (up.error) return; }
    await supabase.from("request_updates").insert({ request_id: requestId, author_id: user.id, from_team: asTeam, message: msg || "File shared", file_path });
    setMsg(""); qc.invalidateQueries({ queryKey: ["updates", requestId] });
  };
  return <div className="thread">
    {data.map((u) => <div key={u.id} className={u.from_team ? "msg team" : "msg"}><b>{u.from_team ? "ZameenDhan team" : "You"}</b> {u.message}{u.file_path && <button type="button" onClick={() => openFile(u.file_path!)}>Open file</button>}</div>)}
    <div className="thread-input"><input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write a message"/><label className="file-btn">Attach<input type="file" hidden onChange={(e) => e.target.files?.[0] && send(e.target.files[0])}/></label><Button size="sm" onClick={() => send()}><Send size={14}/></Button></div>
  </div>;
}

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
