import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileCheck2, Gavel, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryInfo, inr, services } from "@/lib/services";
import heroImage from "@/assets/property-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ZameenDhan — Property Transaction, Legal & Auction Services" },
    { name: "description", content: "Buying, selling, leasing, title verification, agreement drafting, RERA registration and live property auctions — handled by the ZameenDhan team." },
    { property: "og:title", content: "ZameenDhan — Every property service, one platform" },
    { property: "og:description", content: "Transactions, legal & compliance and live auctions for owners, buyers and builders." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HomePage,
});

function HomePage() {
  return <div>
    <section className="market-hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-shade"/><div className="hero-content content-width">
        <p className="hero-kicker">PROPERTY SERVICES, DONE FOR YOU</p>
        <h1>Every property task. One trusted team.</h1>
        <p>Transactions, legal paperwork and live auctions for owners, buyers and builders across India.</p>
        <div className="hero-actions">
          <Button asChild size="lg"><Link to="/services/$category" params={{ category: "transaction" }}>Book a service <ArrowRight size={18}/></Link></Button>
          <Button asChild size="lg" variant="secondary"><Link to="/auctions">View live auctions <Gavel size={18}/></Link></Button>
        </div>
        <div className="hero-trust"><span><CheckCircle2/>Fixed, upfront fees</span><span><CheckCircle2/>Track every step online</span><span><CheckCircle2/>Expert-handled</span></div>
      </div>
    </section>

    <section className="listing-section content-width">
      <div className="section-heading"><div><p className="eyebrow">WHAT WE DO</p><h2>Three ways we help</h2></div></div>
      <div className="service-group-grid">
        {(["transaction", "legal"] as const).map((cat) => <Link key={cat} to="/services/$category" params={{ category: cat }} className="service-group">
          {cat === "transaction" ? <Handshake/> : <FileCheck2/>}
          <p className="eyebrow">{categoryInfo[cat].eyebrow}</p><h3>{categoryInfo[cat].title}</h3><p>{categoryInfo[cat].description}</p>
          <ul>{services.filter((s) => s.category === cat).map((s) => <li key={s.slug}>{s.name}<span>from {inr(s.fee)}</span></li>)}</ul>
          <b>Explore <ArrowRight size={16}/></b>
        </Link>)}
        <Link to="/auctions" className="service-group">
          <Gavel/><p className="eyebrow">BID · WIN · OWN</p><h3>Live auctions</h3><p>Bid online on verified properties. Pay a refundable EMD to join, bid in real time, and pay the balance only if you win.</p>
          <ul><li>Refundable EMD</li><li>Real-time bidding</li><li>Anti-sniping timer</li></ul>
          <b>See auctions <ArrowRight size={16}/></b>
        </Link>
      </div>
    </section>

    <section className="journey-section"><div className="content-width"><div className="section-heading light"><div><p className="eyebrow">HOW IT WORKS</p><h2>Simple, tracked, transparent.</h2></div></div><div className="journey-grid">
      {[["01", "Request", "Pick a service and share your property details."], ["02", "Pay", "Pay a fixed service fee — no hidden charges."], ["03", "We work", "Our team handles it and updates you at every step."], ["04", "Done", "Get documents and outcomes in your dashboard."]].map(([n, t, d]) =>
        <div key={n} className="journey-step"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
    </div></div></section>

    <section className="owner-section"><div className="content-width owner-grid"><div><p className="eyebrow">FOR BUILDERS & DEVELOPERS</p><h2>RERA, agreements and bulk sales — handled.</h2><p>Register projects, draft buyer agreements and run inventory auctions from one account.</p><ul><li><ShieldCheck/>RERA project & agent registration</li><li><FileCheck2/>Standardised agreement drafting</li><li><Gavel/>Auctions for unsold inventory</li></ul><Button asChild size="lg"><Link to="/services/$category" params={{ category: "legal" }}>Legal services <ArrowRight/></Link></Button></div><div className="owner-quote"><p>“Tell us what you need. We take it from there and keep you updated at every step.”</p><strong>Fixed fees. Full tracking.</strong><span>The ZameenDhan promise</span></div></div></section>
  </div>;
}
