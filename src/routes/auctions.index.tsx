import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gavel, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { auctionPhase, inr } from "@/lib/services";

export const Route = createFileRoute("/auctions/")({
  head: () => ({ meta: [
    { title: "Live Property Auctions | ZameenDhan" },
    { name: "description", content: "Bid online on verified properties. Pay a refundable EMD, bid live, and pay the balance only if you win." },
    { property: "og:title", content: "Live Property Auctions | ZameenDhan" },
    { property: "og:description", content: "Bid online on verified properties across India." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AuctionsPage,
});

function AuctionsPage() {
  const { data = [] } = useQuery({ queryKey: ["auctions"], queryFn: async () => {
    const { data } = await supabase.from("auctions").select("*").eq("status", "published").order("ends_at");
    return data ?? [];
  }});
  return <section className="content-width services-page">
    <p className="eyebrow">BID · WIN · OWN</p><h1>Property auctions</h1>
    <p className="lead">Pay a refundable Earnest Money Deposit (EMD) to join, bid live, and pay the balance only if you win. Losing bidders get their EMD back.</p>
    {data.length === 0 ? <div className="empty-state"><Gavel/><h2>No auctions right now</h2><p>New auctions will appear here as soon as they're scheduled.</p></div>
    : <div className="service-cards">{data.map((a) => { const phase = auctionPhase(a); return <Link key={a.id} to="/auctions/$id" params={{ id: a.id }} className="service-card">
        <span className={`phase phase-${phase}`}>{phase}</span><h3>{a.title}</h3>
        <p><MapPin size={14}/> {a.locality}{a.locality && ", "}{a.city}</p>
        <div className="service-card-foot"><div><small>{a.bid_count ? "Current bid" : "Reserve price"}</small><strong>{inr(a.bid_count ? a.current_price : a.reserve_price)}</strong></div><div><small>EMD</small><strong>{inr(a.emd_amount)}</strong></div></div>
        <small>{phase === "upcoming" ? "Starts" : "Ends"} {new Date(phase === "upcoming" ? a.starts_at : a.ends_at).toLocaleString("en-IN")}</small>
      </Link>; })}</div>}
  </section>;
}
