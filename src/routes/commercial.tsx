import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Store, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { useQuery } from "@tanstack/react-query";
import { listProperties } from "@/lib/properties";
import officeImage from "@/assets/property-office.jpg";

export const Route = createFileRoute("/commercial")({ head:()=>({meta:[{title:"Commercial Property in India | Property24"},{name:"description",content:"Find offices, shops and commercial property for sale or rent across India."},{property:"og:title",content:"Commercial Property | Property24"},{property:"og:description",content:"Workspaces and commercial investments, directly from owners."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component: CommercialPage });
function CommercialPage(){
  const { data: all = [] } = useQuery({ queryKey: ["properties"], queryFn: listProperties });
  const commercial=all.filter((p)=>p.purpose==="Commercial");
  const types = [
    { Icon: Building2, label: "Office spaces" },
    { Icon: Store, label: "Retail shops" },
    { Icon: Warehouse, label: "Warehouses" },
  ];
  return <><section className="commercial-hero" style={{backgroundImage:`url(${officeImage})`}}><div className="hero-shade"/><div className="content-width"><p className="eyebrow">COMMERCIAL REAL ESTATE</p><h1>Space for your next big move.</h1><p>Find owner-listed offices, shops and workspaces in India's strongest business districts.</p><Button asChild><Link to="/properties" search={{purpose:"Commercial"}}>Explore spaces <ArrowRight/></Link></Button></div></section><section className="listing-section content-width"><div className="section-heading"><div><p className="eyebrow">FEATURED SPACES</p><h2>Commercial properties</h2></div></div><div className="property-grid">{[...commercial,...commercial,...commercial].map((p,i)=><PropertyCard key={`${p.id}-${i}`} property={p}/>)}</div></section><section className="commercial-types content-width">{types.map(({ Icon, label })=><article key={label}><Icon/><h3>{label}</h3><p>Discover verified options matched to your business needs.</p></article>)}</section></>;
}