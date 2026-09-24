import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bath, BedDouble, Check, CheckCircle2, Heart, MapPin, Maximize2, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getProperty } from "@/lib/properties";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/property/$id")({
  head: () => ({ meta: [
    { title: "Property Details | ZameenDhan" },
    { name: "description", content: "View this owner-listed property on ZameenDhan and contact the owner directly." },
    { property: "og:title", content: "Property Details | ZameenDhan" },
    { property: "og:description", content: "Owner-listed property with zero brokerage on ZameenDhan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: PropertyPage,
});

function PropertyPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: p, isLoading } = useQuery({ queryKey: ["property", id], queryFn: () => getProperty(id) });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <section className="simple-page"><div><h1>Loading property…</h1></div></section>;
  if (!p) return <section className="simple-page"><div><h1>Property not found</h1><Button asChild><Link to="/properties" search={{purpose:"Buy"}}><ArrowLeft/>Back to listings</Link></Button></div></section>;

  const sendInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    const { error: err } = await supabase.from("inquiries").insert({
      property_id: p.id,
      owner_id: p.ownerId ?? null,
      sender_id: user?.id ?? null,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    setBusy(false);
    if (err) { setError("Could not send your enquiry. Please try again."); return; }
    setSent(true);
  };

  return <><section className="detail-top content-width"><Link to="/properties" search={{purpose:p.purpose}}><ArrowLeft/>Back to properties</Link><Button variant="outline" onClick={() => { if (!user) navigate({ to: "/login" }); }}><Heart/>Save</Button></section><section className="detail-gallery content-width"><img src={p.image} alt={p.title} width={1280} height={912}/><img src={p.image} alt={`${p.title} interior view`} width={1280} height={912}/><img src={p.image} alt={`${p.title} additional view`} width={1280} height={912}/></section><section className="detail-layout content-width"><div><span className="listing-badge static">Owner listed</span><h1>{p.title}</h1><p className="property-location"><MapPin/>{p.locality}, {p.city}</p><div className="detail-facts">{p.beds>0&&<span><BedDouble/><b>{p.beds}</b> Bedrooms</span>}<span><Bath/><b>{p.baths}</b> Bathrooms</span><span><Maximize2/><b>{p.area.toLocaleString("en-IN")}</b> sq.ft.</span></div><h2>About this property</h2><p className="detail-description">{p.description}</p>{p.amenities.length > 0 && <><h2>Amenities</h2><div className="amenities">{p.amenities.map(a=><span key={a}><Check/>{a}</span>)}</div></>}</div><aside className="contact-owner"><p>{p.purpose} price</p><h2>{p.price}</h2><span>No brokerage</span>{sent ? <div className="inquiry-sent"><CheckCircle2/><h3>Enquiry sent</h3><p>The owner will reach out to you directly.</p></div> : <form onSubmit={sendInquiry} className="inquiry-form"><label>Your name<input name="name" required placeholder="Enter your name"/></label><label>Email<input name="email" type="email" required placeholder="you@example.com"/></label><label>Phone number<input name="phone" placeholder="+91 98765 43210"/></label><label>Message<textarea name="message" rows={3} placeholder="I'm interested in this property…"/></label>{error && <p className="auth-error" role="alert">{error}</p>}<Button size="lg" type="submit" disabled={busy}><Phone/>Contact owner</Button><small>By continuing, you agree to ZameenDhan's terms.</small></form>}</aside></section></>;
}
