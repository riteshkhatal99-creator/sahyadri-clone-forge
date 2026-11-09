import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { getService, inr, requestStatuses, statusLabel } from "@/lib/services";
import { RequestThread } from "@/components/request-thread";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Team panel | ZameenDhan" }, { name: "description", content: "Manage requests, auctions and payments." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Team panel | ZameenDhan" }, { property: "og:description", content: "Internal team panel." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPage,
});

function AdminPage() {
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState<"requests" | "auctions" | "payments">("requests");
  if (!isAdmin) return <section className="content-width empty-state"><h2>Team access only</h2><p>This area is for ZameenDhan staff.</p></section>;
  return <section className="dashboard-page content-width">
    <div className="dashboard-head"><div><p className="eyebrow">TEAM PANEL</p><h1>Operations</h1></div></div>
    <div className="dashboard-tabs">{(["requests", "auctions", "payments"] as const).map((t) => <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t[0]!.toUpperCase() + t.slice(1)}</Button>)}</div>
    {tab === "requests" && <Requests/>}{tab === "auctions" && <Auctions/>}{tab === "payments" && <Payments/>}
  </section>;
}

function Requests() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);
  const { data = [] } = useQuery({ queryKey: ["admin-requests"], queryFn: async () => (await supabase.from("service_requests").select("*").order("created_at", { ascending: false })).data ?? [] });
  const update = async (id: string, patch: { status?: string; paid?: boolean }) => { await supabase.from("service_requests").update(patch).eq("id", id); qc.invalidateQueries({ queryKey: ["admin-requests"] }); };
  if (!data.length) return <div className="empty-state"><h2>No requests yet</h2></div>;
  return <div className="dashboard-list">{data.map((r) => <div key={r.id} className="dashboard-row request-row">
    <div className="request-top"><div><h3>#{r.ref_no} · {getService(r.service_slug)?.name}</h3><p>Fee to be confirmed · {r.paid ? "Paid" : "Unpaid"} · {new Date(r.created_at).toLocaleDateString("en-IN")}</p>
      <p className="details">{Object.entries(r.details as Record<string, string>).filter(([, v]) => v).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(" · ")}</p></div>
      <div className="dashboard-actions"><select value={r.status} onChange={(e) => update(r.id, { status: e.target.value })}>{[...requestStatuses, "cancelled"].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}</select>
        <Button size="sm" variant="outline" onClick={() => setOpen(open === r.id ? null : r.id)}>Thread</Button></div></div>
    {open === r.id && <RequestThread requestId={r.id} asTeam/>}
  </div>)}</div>;
}

function Auctions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data = [] } = useQuery({ queryKey: ["admin-auctions"], queryFn: async () => (await supabase.from("auctions").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [sel, setSel] = useState<string | null>(null);
  const { data: regs = [] } = useQuery({ queryKey: ["admin-regs", sel], enabled: !!sel, queryFn: async () => (await supabase.from("auction_registrations").select("*").eq("auction_id", sel!)).data ?? [] });
  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!user) return; setBusy(true);
    const f = new FormData(e.currentTarget); const g = (k: string) => String(f.get(k) ?? "");
    let image_path: string | null = null; const file = f.get("photo");
    if (file instanceof File && file.size) { image_path = `${user.id}/auction-${Date.now()}.${file.name.split(".").pop()}`; await supabase.storage.from("property-photos").upload(image_path, file); }
    const { error } = await supabase.from("auctions").insert({ title: g("title"), city: g("city"), locality: g("locality"), property_type: g("type"), carpet_area: Number(g("area")), description: g("description"), reserve_price: Number(g("reserve")), bid_step: Number(g("step")), emd_amount: Number(g("emd")), starts_at: new Date(g("starts")).toISOString(), ends_at: new Date(g("ends")).toISOString(), image_path, created_by: user.id });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Auction created"); e.currentTarget.reset(); qc.invalidateQueries({ queryKey: ["admin-auctions"] });
  };
  const setEmd = async (auction_id: string, user_id: string, emd_status: string) => { await supabase.from("auction_registrations").update({ emd_status }).eq("auction_id", auction_id).eq("user_id", user_id); qc.invalidateQueries({ queryKey: ["admin-regs", sel] }); };
  const settle = async (a: typeof data[number]) => {
    for (const r of regs) if (r.user_id !== a.current_winner && r.emd_status === "paid") await setEmd(a.id, r.user_id, "refund_due");
    toast.success("Losing bidders' EMDs marked for refund");
  };
  return <>
    <form className="auth-form admin-form" onSubmit={create}>
      <h3>New auction</h3>
      <label>Title<input name="title" required/></label><label>City<input name="city" required/></label><label>Locality<input name="locality"/></label>
      <label>Property type<select name="type">{["Apartment", "Villa", "Plot", "Office", "Shop", "Warehouse"].map((t) => <option key={t}>{t}</option>)}</select></label>
      <label>Carpet area (sq.ft.)<input name="area" type="number" min={0} defaultValue={0}/></label>
      <label>Reserve price (₹)<input name="reserve" type="number" min={1} required/></label><label>Bid step (₹)<input name="step" type="number" min={1} defaultValue={50000} required/></label><label>EMD for this auction (₹)<input name="emd" type="number" min={1} required/><small>Set this per auction using its published terms; there is no single iQuippo-wide amount.</small></label>
      <label>Starts<input name="starts" type="datetime-local" required/></label><label>Ends<input name="ends" type="datetime-local" required/></label>
      <label>Description<textarea name="description" rows={3}/></label><label>Photo<input name="photo" type="file" accept="image/*"/></label>
      <Button type="submit" disabled={busy}>Create auction</Button>
    </form>
    <div className="dashboard-list">{data.map((a) => <div key={a.id} className="dashboard-row request-row"><div className="request-top"><div><h3>{a.title}</h3><p>{a.bid_count} bids · {inr(a.current_price || a.reserve_price)} · ends {new Date(a.ends_at).toLocaleString("en-IN")}</p></div><Button size="sm" variant="outline" onClick={() => setSel(sel === a.id ? null : a.id)}>Registrations</Button></div>
      {sel === a.id && <div className="thread">{regs.length === 0 ? <p>No registrations.</p> : regs.map((r) => <div key={r.user_id} className="msg"><b>Bidder {r.user_id.slice(0, 6)}</b> EMD: {r.emd_status} {r.user_id === a.current_winner && "· Winner"}
        <select value={r.emd_status} onChange={(e) => setEmd(a.id, r.user_id, e.target.value)}>{["pending", "paid", "refund_due", "refunded", "forfeited"].map((s) => <option key={s}>{s}</option>)}</select></div>)}
        {new Date(a.ends_at) < new Date() && <Button size="sm" onClick={() => settle(a)}>Settle: mark refunds</Button>}</div>}
    </div>)}</div>
  </>;
}

function Payments() {
  const { data = [] } = useQuery({ queryKey: ["admin-payments"], queryFn: async () => (await supabase.from("payments").select("*").order("created_at", { ascending: false })).data ?? [] });
  if (!data.length) return <div className="empty-state"><h2>No payments yet</h2></div>;
  return <div className="dashboard-list">{data.map((p) => <div key={p.id} className="dashboard-row"><div><h3>{inr(p.amount)} · {p.kind.replace("_", " ")}</h3><p>{p.status} · {new Date(p.created_at).toLocaleString("en-IN")}</p></div></div>)}</div>;
}
