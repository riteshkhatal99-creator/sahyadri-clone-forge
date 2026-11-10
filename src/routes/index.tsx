import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileCheck2, Gavel, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryInfo, services } from "@/lib/services";
import heroImage from "@/assets/property-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Property24 — Property Transaction, Legal & Auction Services" },
    { name: "description", content: "Buying, selling, leasing, title verification, agreement drafting, RERA registration and live property auctions — handled by the Property24 team." },
    { property: "og:title", content: "Property24 — Every property service, one platform" },
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
        <h1>Property24<br/>Property services.</h1>
        <p>Buying, selling, leasing or managing property paperwork? Choose your service, share the property details and keep your requests, documents and team conversations together.</p>
        <div className="hero-actions">
          <Button asChild size="lg"><Link to="/services/$category" params={{ category: "transaction" }}>Book a service <ArrowRight size={18}/></Link></Button>
          <Button asChild size="lg" variant="secondary"><Link to="/auctions">Explore auctions <Gavel size={18}/></Link></Button>
        </div>
        <div className="hero-trust"><span><CheckCircle2/>Buying & selling</span><span><CheckCircle2/>Legal & compliance</span><span><CheckCircle2/>Property auctions</span></div>
      </div>
    </section>

    <section className="listing-section content-width">
      <div className="section-heading"><div><p className="eyebrow">WHAT DO YOU NEED HELP WITH?</p><h2>Start with your property task</h2><p className="section-intro">Compare services and check what to prepare before starting your request.</p></div></div>
      <div className="service-group-grid">
        {(["transaction", "legal"] as const).map((cat) => <Link key={cat} to="/services/$category" params={{ category: cat }} className="service-group">
          {cat === "transaction" ? <Handshake/> : <FileCheck2/>}
          <p className="eyebrow">{categoryInfo[cat].eyebrow}</p><h3>{categoryInfo[cat].title}</h3><p>{categoryInfo[cat].description}</p>
          <ul>{services.filter((s) => s.category === cat).map((s) => <li key={s.slug}>{s.name}</li>)}</ul>
          <small>Fees confirmed after reviewing your request.</small>
          <b>Explore <ArrowRight size={16}/></b>
        </Link>)}
        <Link to="/auctions" className="service-group">
          <Gavel/><p className="eyebrow">EXPLORE · REGISTER · BID</p><h3>Property auctions</h3><p>Review scheduled properties, reserve prices and bidding windows. Registration requires a team-confirmed deposit before bidding.</p>
          <ul><li>Reserve price & bid history</li><li>Minimum bid increments</li><li>Late-bid timer extensions</li></ul>
          <small>EMD is set per auction; deposit payments and refunds are not automated.</small>
          <b>See auctions <ArrowRight size={16}/></b>
        </Link>
      </div>
    </section>

    <section className="journey-section"><div className="content-width"><div className="section-heading light"><div><p className="eyebrow">HOW IT WORKS</p><h2>Simple, tracked, transparent.</h2></div></div><div className="journey-grid">
      {[["01", "Choose your service", "Compare transaction or legal services and review the request scope."], ["02", "Share your details", "Sign in and submit the property details and any supporting documents."], ["03", "Confirm the scope", "Agree the final fee and next steps with the team. Online checkout is not connected yet."], ["04", "Follow your request", "Read status updates, exchange messages and access shared documents in My requests."]].map(([n, t, d]) =>
        <div key={n} className="journey-step"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
    </div></div></section>

    <section className="owner-section"><div className="content-width owner-grid"><div><p className="eyebrow">FOR OWNERS, BUYERS & DEVELOPERS</p><h2>Know what to prepare.</h2><p>Transaction requests need location, property type, carpet area, possession status and your expected price. Legal requests need document type, stamp duty details, Sub-Registrar office and party names.</p><ul><li><ShieldCheck/>Title verification & RERA assistance</li><li><FileCheck2/>Sale and lease agreement drafting</li><li><Gavel/>Auction details & participation requirements</li></ul><Button asChild size="lg"><Link to="/services/$category" params={{ category: "legal" }}>Compare legal services <ArrowRight/></Link></Button></div><div className="owner-quote"><p>Your property request, from submission to updates.</p><strong>Documents. Conversations. Progress.</strong><span>Confirm the service scope, charges and timelines before proceeding.</span></div></div></section>
  </div>;
}
