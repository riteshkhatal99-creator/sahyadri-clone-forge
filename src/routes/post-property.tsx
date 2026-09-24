import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, CheckCircle2, Home, Upload } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/properties";

export const Route = createFileRoute("/post-property")({
  head: () => ({ meta: [
    { title: "Post Property for Free | ZameenDhan" },
    { name: "description", content: "List your residential or commercial property for free and connect directly with buyers and tenants." },
    { property: "og:title", content: "Post Property Free | ZameenDhan" },
    { property: "og:description", content: "Reach genuine property seekers without paying brokerage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: PostPropertyPage,
});

function PostPropertyPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState<"residential" | "commercial">("residential");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setError(""); setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const intent = String(form.get("intent") ?? "Sell");
      const purpose = category === "commercial" ? "Commercial" : intent === "Sell" ? "Buy" : "Rent";
      const priceValue = Number(form.get("price") ?? 0);
      const photo = form.get("photo");
      let imagePath: string | null = null;
      if (photo instanceof File && photo.size > 0) {
        const ext = photo.name.split(".").pop() ?? "jpg";
        imagePath = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("property-photos").upload(imagePath, photo);
        if (uploadError) throw uploadError;
      }
      const { error: insertError } = await supabase.from("properties").insert({
        owner_id: user.id,
        title: String(form.get("title") ?? ""),
        city: String(form.get("city") ?? ""),
        locality: String(form.get("locality") ?? ""),
        type: String(form.get("type") ?? "Apartment"),
        purpose,
        price_value: priceValue,
        price_display: formatPrice(priceValue, purpose),
        beds: Number(form.get("beds") ?? 0),
        baths: Number(form.get("baths") ?? 0),
        area: Number(form.get("area") ?? 0),
        description: String(form.get("description") ?? ""),
        image_path: imagePath,
        image_key: imagePath ? null : category === "commercial" ? "office" : "apartment",
        status: "published",
      });
      if (insertError) throw insertError;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish your listing. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <section className="simple-page"><div><h1>Loading…</h1></div></section>;

  if (!user) return <section className="simple-page"><div><p className="eyebrow">OWNER DIRECT</p><h1>Sign in to post your property</h1><p>Posting is free — you just need a ZameenDhan account so buyers can reach you and you can manage your listings.</p><Button asChild size="lg"><Link to="/login">Sign in or create account</Link></Button></div></section>;

  return <section className="post-page"><div className="post-intro"><div><p className="eyebrow">OWNER DIRECT</p><h1>List your property. Meet genuine seekers.</h1><p>It takes only a few minutes and costs nothing to get started.</p><ul><li><CheckCircle2/>Zero brokerage</li><li><CheckCircle2/>Verified enquiries</li><li><CheckCircle2/>You control every conversation</li></ul></div></div><div className="post-form-wrap"><form className="post-form" onSubmit={submit}><span>Publish instantly</span><h2>Tell us about your property</h2><div className="purpose-picks"><label><input type="radio" name="category" checked={category==="residential"} onChange={()=>setCategory("residential")}/><Home/>Residential</label><label><input type="radio" name="category" checked={category==="commercial"} onChange={()=>setCategory("commercial")}/><Building2/>Commercial</label></div><label>Property title<input name="title" required placeholder="e.g. Sunview Residences"/></label><div className="form-row">{category==="residential" && <label>I want to<select name="intent" required><option>Sell</option><option>Rent / Lease</option></select></label>}<label>Property type<select name="type" required>{category==="residential" ? <><option>Apartment</option><option>Villa</option><option>Plot</option></> : <><option>Office</option><option>Shop</option></>}</select></label></div><div className="form-row"><label>City<input name="city" required placeholder="e.g. Bengaluru"/></label><label>Locality<input name="locality" required placeholder="e.g. Whitefield"/></label></div><div className="form-row"><label>Expected price (₹)<input name="price" required type="number" min={1} placeholder="Enter amount"/></label><label>Area (sq.ft.)<input name="area" required type="number" min={1} placeholder="e.g. 1200"/></label></div>{category==="residential" && <div className="form-row"><label>Bedrooms<input name="beds" type="number" min={0} defaultValue={2}/></label><label>Bathrooms<input name="baths" type="number" min={0} defaultValue={2}/></label></div>}<label>Description<textarea name="description" rows={4} placeholder="Highlight what makes your property special…"/></label><label className="upload-box"><Upload/><b>Add a property photo</b><span>JPG or PNG, up to 10 MB</span><input name="photo" type="file" accept="image/*"/></label>{error && <p className="auth-error" role="alert">{error}</p>}<Button type="submit" size="lg" disabled={busy}>{busy ? "Publishing…" : "Publish listing"}</Button></form></div></section>;
}
