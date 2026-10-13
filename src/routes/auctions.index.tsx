import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gavel, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceFaq } from "@/components/service-faq";
import { auctionQuestions } from "@/lib/service-guidance";
import { supabase } from "@/integrations/supabase/client";
import { auctionPhase, inr } from "@/lib/services";

export const Route = createFileRoute("/auctions/")({
  head: () => ({ meta: [
    { title: "Live Property Auctions | ZameenDhan" },
    { name: "description", content: "Explore property auctions, reserve prices, bidding windows and deposit requirements on ZameenDhan." },
    { property: "og:title", content: "Live Property Auctions | ZameenDhan" },
    { property: "og:description", content: "Review property auction details and participation requirements before bidding." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AuctionsPage,
});

function AuctionsPage() {
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [query, setQuery] = useState("");
  const { data = [], isPending, isError, refetch } = useQuery({ queryKey: ["auctions"], queryFn: async () => {
    const { data, error } = await supabase.from("auctions").select("*").eq("status", "published").order("ends_at");
    if (error) throw error;
    return data ?? [];
  }});
  const filtered = data.filter((a) => (phaseFilter === "all" || auctionPhase(a) === phaseFilter) && `${a.title} ${a.city} ${a.locality ?? ""} ${a.property_type}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="content-width services-page">
    <Link to="/" className="back-link">Home / Auctions</Link>
    <p className="eyebrow">EXPLORE · REGISTER · BID</p><h1>Property auctions</h1>
    <p className="lead">Compare reserve prices, locations and bidding windows. Review the property and the organiser’s terms before committing a deposit or placing a bid.</p>
    <div className="service-notice"><strong>Participation & payment status</strong><p>Online deposit collection, automatic refunds and sale settlement are not connected. Registration does not take a payment. Bidding is available only after the team confirms your deposit.</p></div>
    <div className="auction-guide"><div><span>01</span><h3>Review the property</h3><p>Check the description, reserve price, deposit amount and dates. Obtain property records and written auction terms.</p></div><div><span>02</span><h3>Register & confirm deposit</h3><p>Sign in and register your interest. Agree payment instructions and refund terms with the organiser.</p></div><div><span>03</span><h3>Bid during the window</h3><p>After deposit confirmation, meet the minimum next bid. Late bids can extend the closing time.</p></div></div>
    <div className="auction-filters"><label>Search auctions<input type="search" placeholder="Property, city or locality" value={query} onChange={(e) => setQuery(e.target.value)}/></label><label>Auction status<select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}><option value="all">All auctions</option><option value="live">Live now</option><option value="upcoming">Upcoming</option><option value="ended">Ended</option></select></label></div>
    {isPending ? <div className="empty-state" role="status">Loading auctions…</div> : isError ? <div className="empty-state" role="alert"><h2>Auctions could not be loaded</h2><Button variant="outline" onClick={() => refetch()}>Try again</Button></div> : filtered.length === 0 ? <div className="empty-state"><Gavel/><h2>{data.length ? "No matching auctions" : "No auctions scheduled yet"}</h2><p>{data.length ? "Try another city or auction status." : "There are no published property auctions available to join. You can still explore transaction and legal services."}</p><Button asChild variant="outline"><Link to="/services/$category" params={{ category: "transaction" }}>Explore property services</Link></Button></div>
    : <div className="service-cards">{filtered.map((a) => { const phase = auctionPhase(a); return <Link key={a.id} to="/auctions/$id" params={{ id: a.id }} className="service-card">
        <span className={`phase phase-${phase}`}>{phase}</span><h3>{a.title}</h3>
        <p><MapPin size={14}/> {a.locality}{a.locality && ", "}{a.city}</p>
        <div className="service-card-foot"><div><small>{a.bid_count ? "Current bid" : "Reserve price"}</small><strong>{inr(a.bid_count ? a.current_price : a.reserve_price)}</strong></div><div><small>EMD</small><strong>{inr(a.emd_amount)}</strong></div></div>
        <small>{phase === "upcoming" ? "Starts" : "Ends"} {new Date(phase === "upcoming" ? a.starts_at : a.ends_at).toLocaleString("en-IN")}</small>
      </Link>; })}</div>}
    <ServiceFaq items={auctionQuestions}/>
  </section>;
}
