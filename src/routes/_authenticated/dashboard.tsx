import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Heart, Inbox, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { listMyProperties, getProperty, type Property } from "@/lib/properties";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "My Dashboard | ZameenDhan" },
    { name: "description", content: "Manage your listings, enquiries and saved homes on ZameenDhan." },
    { property: "og:title", content: "My Dashboard | ZameenDhan" },
    { property: "og:description", content: "Manage your listings, enquiries and saved homes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: DashboardPage,
});

type Inquiry = { id: string; name: string; email: string; phone: string | null; message: string; created_at: string; property_id: string };

function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"listings" | "inquiries" | "saved">("listings");

  const { data: myListings = [] } = useQuery({
    queryKey: ["my-properties", user?.id],
    queryFn: () => listMyProperties(user!.id),
    enabled: !!user,
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ["my-inquiries", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("inquiries").select("*").eq("owner_id", user!.id).order("created_at", { ascending: false });
      return (data ?? []) as unknown as Inquiry[];
    },
  });

  const { data: saved = [] } = useQuery({
    queryKey: ["my-favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("favorites").select("property_id").eq("user_id", user!.id);
      const ids = (data ?? []).map((row: { property_id: string }) => row.property_id);
      const items = await Promise.all(ids.map((id: string) => getProperty(id)));
      return items.filter((item): item is Property => !!item);
    },
  });

  const removeListing = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  return <section className="dashboard-page content-width">
    <div className="dashboard-head"><div><p className="eyebrow">MY ACCOUNT</p><h1>Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}</h1><p>{user?.email}</p></div><Button asChild size="lg"><Link to="/post-property"><Plus/>Post property</Link></Button></div>
    <div className="dashboard-tabs" role="tablist">
      <Button variant={tab==="listings"?"default":"outline"} onClick={()=>setTab("listings")}><Building2 size={16}/>My listings ({myListings.length})</Button>
      <Button variant={tab==="inquiries"?"default":"outline"} onClick={()=>setTab("inquiries")}><Inbox size={16}/>Enquiries ({inquiries.length})</Button>
      <Button variant={tab==="saved"?"default":"outline"} onClick={()=>setTab("saved")}><Heart size={16}/>Saved homes ({saved.length})</Button>
    </div>

    {tab === "listings" && (myListings.length
      ? <div className="dashboard-list">{myListings.map(p => <div key={p.id} className="dashboard-row"><img src={p.image} alt={p.title}/><div><h3>{p.title}</h3><p>{p.locality}, {p.city} · {p.purpose} · {p.price}</p></div><div className="dashboard-actions"><Button asChild variant="outline" size="sm"><Link to="/property/$id" params={{ id: p.id }}>View</Link></Button><Button variant="ghost" size="icon" aria-label={`Delete ${p.title}`} onClick={()=>removeListing(p.id)}><Trash2 size={17}/></Button></div></div>)}</div>
      : <div className="empty-state"><h2>No listings yet</h2><p>Post your first property — it takes two minutes and it's free.</p><Link to="/post-property">Post property free</Link></div>)}

    {tab === "inquiries" && (inquiries.length
      ? <div className="dashboard-list">{inquiries.map(inquiry => <div key={inquiry.id} className="dashboard-row inquiry-row"><div><h3>{inquiry.name}</h3><p>{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p>{inquiry.message && <p className="inquiry-message">“{inquiry.message}”</p>}<small>{new Date(inquiry.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small></div></div>)}</div>
      : <div className="empty-state"><h2>No enquiries yet</h2><p>When buyers or tenants contact you about your listings, they'll appear here.</p></div>)}

    {tab === "saved" && (saved.length
      ? <div className="property-grid results-grid">{saved.map(p => <PropertyCard key={p.id} property={p}/>)}</div>
      : <div className="empty-state"><h2>No saved homes</h2><p>Tap the heart on any property to keep it here.</p><Link to="/properties" search={{ purpose: "Buy" }}>Browse properties</Link></div>)}
  </section>;
}
