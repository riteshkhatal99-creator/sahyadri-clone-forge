import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { auctionPhase, inr, minNextBid, validateBid } from "@/lib/services";
import { ServiceFaq } from "@/components/service-faq";
import { auctionQuestions } from "@/lib/service-guidance";

export const Route = createFileRoute("/auctions/$id")({
  head: () => ({ meta: [
    { title: "Auction details | ZameenDhan" }, { name: "description", content: "Live property auction with real-time bidding on ZameenDhan." },
    { property: "og:title", content: "Auction details | ZameenDhan" }, { property: "og:description", content: "Bid live on this property." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AuctionPage,
});

function useNow() { const [n, setN] = useState(() => new Date()); useEffect(() => { const t = setInterval(() => setN(new Date()), 1000); return () => clearInterval(t); }, []); return n; }
function countdown(ms: number) { if (ms <= 0) return "00:00:00"; const s = Math.floor(ms / 1000); const d = Math.floor(s / 86400); const h = String(Math.floor(s % 86400 / 3600)).padStart(2, "0"); const m = String(Math.floor(s % 3600 / 60)).padStart(2, "0"); return `${d ? d + "d " : ""}${h}:${m}:${String(s % 60).padStart(2, "0")}`; }

function AuctionPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const now = useNow();
  const [amount, setAmount] = useState("");
  const { data: a } = useQuery({ queryKey: ["auction", id], queryFn: async () => (await supabase.from("auctions").select("*").eq("id", id).maybeSingle()).data });
  const { data: bids = [] } = useQuery({ queryKey: ["bids", id], queryFn: async () => (await supabase.from("bids").select("id, amount, user_id, created_at").eq("auction_id", id).order("created_at", { ascending: false }).limit(20)).data ?? [] });
  const { data: reg } = useQuery({ queryKey: ["reg", id, user?.id], enabled: !!user, queryFn: async () => { if (!user) return null; return (await supabase.from("auction_registrations").select("*").eq("auction_id", id).eq("user_id", user.id).maybeSingle()).data; } });
  const { data: image } = useQuery({ queryKey: ["auction-img", a?.image_path], enabled: !!a?.image_path, queryFn: async () => { if (!a?.image_path) return null; return (await supabase.storage.from("property-photos").createSignedUrl(a.image_path, 3600)).data?.signedUrl ?? null; } });

  useEffect(() => {
    const ch = supabase.channel(`auction-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "auctions", filter: `id=eq.${id}` }, () => qc.invalidateQueries({ queryKey: ["auction", id] }))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bids", filter: `auction_id=eq.${id}` }, () => qc.invalidateQueries({ queryKey: ["bids", id] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, qc]);

  if (!a) return <section className="content-width empty-state"><h2>Loading auction…</h2></section>;
  const phase = auctionPhase(a, now);
  const emdPaid = reg?.emd_status === "paid";
  const nextMin = minNextBid(a);

  const register = async () => {
    if (!user) return;
    const { error } = await supabase.from("auction_registrations").insert({ auction_id: id, user_id: user.id });
    if (error) { toast.error("Could not register"); return; }
    toast.success("Interest registered. This does not collect an EMD.");
    qc.invalidateQueries({ queryKey: ["reg", id] });
  };
  const bid = async () => {
    const value = Number(amount || nextMin);
    const err = validateBid(a, value, emdPaid, now);
    if (err) { toast.error(err); return; }
    const { error } = await supabase.rpc("place_bid", { _auction: id, _amount: value });
    if (error) { toast.error(error.message); return; }
    toast.success(`Bid of ${inr(value)} placed`); setAmount("");
    qc.invalidateQueries({ queryKey: ["auction", id] }); qc.invalidateQueries({ queryKey: ["bids", id] });
  };

  return <section className="content-width auction-page">
    <div className="auction-main">
      <Link to="/auctions" className="back-link">← All property auctions</Link>
      {image && <img src={image} alt={a.title} className="auction-image"/>}
      <span className={`phase phase-${phase}`}>{phase}</span>
      <h1>{a.title}</h1><p className="lead">{a.locality}{a.locality && ", "}{a.city} · {a.property_type}{a.carpet_area ? ` · ${a.carpet_area.toLocaleString("en-IN")} sq.ft. carpet` : ""}</p>
      <p>{a.description}</p>
      <div className="service-notice"><strong>Before you bid</strong><p>Obtain the property records, inspection details and written auction terms from the organiser. EMD and refund conditions are specific to each auction. Online deposit collection, automated refunds and ownership transfer are not connected.</p></div>
      <h2>Bid history</h2>
      {bids.length === 0 ? <p>No bids yet.</p> : <ul className="bid-list">{bids.map((b) => <li key={b.id}><strong>{inr(b.amount)}</strong><span>{b.user_id === user?.id ? "You" : `Bidder ${b.user_id.slice(0, 4).toUpperCase()}`}</span><small>{new Date(b.created_at).toLocaleTimeString("en-IN")}</small></li>)}</ul>}
      <ServiceFaq items={auctionQuestions}/>
    </div>
    <aside className="auction-panel">
      <small>{phase === "upcoming" ? "Starts in" : phase === "live" ? "Ends in" : "Auction ended"}</small>
      <div className="countdown">{phase === "ended" ? "—" : countdown((phase === "upcoming" ? new Date(a.starts_at) : new Date(a.ends_at)).getTime() - now.getTime())}</div>
      <dl><dt>{a.bid_count ? "Current bid" : "Reserve price"}</dt><dd>{inr(a.bid_count ? a.current_price : a.reserve_price)}</dd><dt>Bid step</dt><dd>{inr(a.bid_step)}</dd><dt>EMD deposit</dt><dd>{inr(a.emd_amount)}</dd><dt>Bids</dt><dd>{a.bid_count}</dd></dl>
      {phase === "ended" ? (user && a.current_winner === user.id ? <p className="auth-notice">You are the highest bidder. Confirm the outcome and balance payment instructions with the organiser. The listed balance deadline is {a.balance_due_hours} hours.</p> : <p>Bidding is closed.</p>)
      : !user ? <Button asChild size="lg"><Link to="/login">Sign in to bid</Link></Button>
      : !reg ? <><Button size="lg" onClick={register}>Register interest</Button><small>EMD required: {inr(a.emd_amount)}. Registration does not charge you. Payment confirmation is manual.</small></>
      : !emdPaid ? <p className="auth-notice">EMD payment {reg.emd_status}. You can bid once it's confirmed.</p>
      : <div className="bid-box"><input type="number" min={nextMin} step={a.bid_step} placeholder={String(nextMin)} value={amount} onChange={(e) => setAmount(e.target.value)}/><Button size="lg" disabled={phase !== "live"} onClick={bid}>Bid {inr(Number(amount || nextMin))}</Button><small>Minimum next bid {inr(nextMin)}. Bids in the last {a.extension_minutes} min extend the timer.</small></div>}
    </aside>
  </section>;
}
