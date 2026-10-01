import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, Home, KeyRound, MapPin, Search, ShieldCheck, Store, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { cities, listProperties } from "@/lib/properties";
import heroImage from "@/assets/property-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ZameenDhan — Buy, Rent & Sell Property Without Brokerage" },
    { name: "description", content: "Discover owner-listed homes and commercial property across India. Buy, rent or sell directly on ZameenDhan." },
    { property: "og:title", content: "ZameenDhan — Property, without the middleman" },
    { property: "og:description", content: "Find verified homes and commercial spaces across India." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState("Buy");
  const [city, setCity] = useState("Bengaluru");
  const [query, setQuery] = useState("");
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: listProperties });
  const featured = properties.filter((p) => p.featured).slice(0, 4);
  const submit = (event: FormEvent) => { event.preventDefault(); navigate({ to: "/properties", search: { purpose, city, q: query } }); };
  return <div>
    <section className="market-hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-shade"/><div className="hero-content content-width">
        <p className="hero-kicker">PROPERTY, WITHOUT THE MIDDLEMAN</p><h1>A better place to find your place.</h1><p>Buy, rent or sell verified homes and commercial spaces directly with owners across India.</p>
        <form className="search-panel" onSubmit={submit}>
          <div className="search-tabs" role="tablist">{["Buy","Rent","Commercial"].map(item => <Button type="button" variant="ghost" className={purpose === item ? "active" : ""} onClick={() => setPurpose(item)} key={item}>{item}</Button>)}</div>
          <div className="search-fields"><label><MapPin size={19}/><span>City</span><select value={city} onChange={e => setCity(e.target.value)}>{cities.map(item => <option key={item}>{item}</option>)}</select></label><label className="location-field"><Search size={19}/><span>Locality or project</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Whitefield, Worli, Baner..."/></label><Button type="submit" size="lg">Search properties <ArrowRight size={18}/></Button></div>
        </form>
        <div className="hero-trust"><span><CheckCircle2/>Verified listings</span><span><CheckCircle2/>Direct owner contact</span><span><CheckCircle2/>Zero brokerage</span></div>
      </div>
    </section>

    <section className="market-stats content-width">{[["1.2L+","Active listings"],["80+","Indian cities"],["65K+","Happy families"],["₹0","Brokerage paid"]].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>

    <section className="listing-section content-width"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Homes worth discovering</h2></div><Link to="/properties" search={{ purpose: "Buy" }}>View all properties <ArrowRight size={17}/></Link></div><div className="property-grid">{(featured.length ? featured : properties.slice(0,4)).map(property => <PropertyCard key={property.id} property={property}/>)}</div></section>

    <section className="journey-section"><div className="content-width"><div className="section-heading light"><div><p className="eyebrow">THE ZAMEENDHAN WAY</p><h2>One platform. Every property journey.</h2></div></div><div className="journey-grid">
      <Link to="/properties" search={{ purpose: "Buy" }}><Home/><span>01</span><h3>Buy a home</h3><p>Explore owner-listed apartments, villas and plots with transparent details.</p><b>Start exploring <ArrowRight/></b></Link>
      <Link to="/properties" search={{ purpose: "Rent" }}><KeyRound/><span>02</span><h3>Rent your next place</h3><p>Find a home that fits your lifestyle and connect directly with the owner.</p><b>Find rentals <ArrowRight/></b></Link>
      <Link to="/post-property"><Users/><span>03</span><h3>Sell or let property</h3><p>Post in minutes and speak to serious buyers and tenants without brokerage.</p><b>Post for free <ArrowRight/></b></Link>
      <Link to="/commercial"><Store/><span>04</span><h3>Go commercial</h3><p>Discover offices, shops and workspaces in India's leading business hubs.</p><b>View commercial <ArrowRight/></b></Link>
    </div></div></section>

    <section className="city-section content-width"><div className="section-heading"><div><p className="eyebrow">EXPLORE INDIA</p><h2>Popular cities</h2></div></div><div className="city-grid">{cities.map((item,index)=><Link to="/properties" search={{ city:item, purpose:"Buy" }} key={item}><span>0{index+1}</span><h3>{item}</h3><p>{properties.filter(p=>p.city===item).length} {properties.filter(p=>p.city===item).length===1?"property":"properties"}</p><ArrowRight/></Link>)}</div></section>

    <section className="owner-section"><div className="content-width owner-grid"><div><p className="eyebrow">FOR PROPERTY OWNERS</p><h2>Your property deserves genuine attention.</h2><p>List directly, choose who contacts you and manage every enquiry from one simple place.</p><ul><li><ShieldCheck/>Owner verification for stronger trust</li><li><Building2/>Residential and commercial listings</li><li><Users/>Direct access to serious seekers</li></ul><Button asChild size="lg"><Link to="/post-property">Post property free <ArrowRight/></Link></Button></div><div className="owner-quote"><p>“Within a week, I found a family for my apartment without paying a rupee in brokerage.”</p><strong>Arvind Menon</strong><span>Property owner, Bengaluru</span></div></div></section>
  </div>;
}
