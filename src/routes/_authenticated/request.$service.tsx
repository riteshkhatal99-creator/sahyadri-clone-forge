import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fieldsByCategory, getService } from "@/lib/services";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/request/$service")({
  head: () => ({ meta: [
    { title: "Request a service | Property24" }, { name: "description", content: "Share your property details and book a Property24 service." },
    { property: "og:title", content: "Request a service | Property24" }, { property: "og:description", content: "Book a property service." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: RequestPage,
});

function RequestPage() {
  const { service: slug } = Route.useParams();
  const service = getService(slug);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  if (!service) return <section className="content-width empty-state"><h2>Service not found</h2><Link to="/">Go home</Link></section>;
  const fields = fieldsByCategory[service.category];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!user) return; setBusy(true);
    const form = new FormData(e.currentTarget);
    const details: Record<string, string> = {};
    fields.forEach((f) => { details[f.name] = String(form.get(f.name) ?? ""); });
    details["notes"] = String(form.get("notes") ?? "");
    const { data, error } = await supabase.from("service_requests").insert({
      user_id: user.id, service_slug: service.slug, category: service.category, details, status: "submitted",
    }).select("id, ref_no").single();
    if (error || !data) { setBusy(false); toast.error("Could not submit your request. Please try again."); return; }
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      const path = `${data.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("request-files").upload(path, file);
      if (!up.error) await supabase.from("request_updates").insert({ request_id: data.id, author_id: user.id, message: "Document uploaded", file_path: path });
    }
    toast.success(`Request #${data.ref_no} created`);
    navigate({ to: "/dashboard" });
  };

  return <section className="content-width request-page">
    <p className="eyebrow">REQUEST A SERVICE</p><h1>{service.name}</h1><p className="lead">{service.summary}</p>
    <form className="auth-form request-form" onSubmit={submit}>
      {fields.map((f) => <label key={f.name}>{f.label}
        {f.type === "select" ? <select name={f.name} required={f.required}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
          : f.type === "textarea" ? <textarea name={f.name} required={f.required} placeholder={f.placeholder} rows={3}/>
          : <input name={f.name} type={f.type} min={f.type === "number" ? 0 : undefined} required={f.required} placeholder={f.placeholder}/>}
      </label>)}
      {service.category === "legal" && <label>Supporting document (optional)<input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png"/></label>}
      <label>Anything else we should know?<textarea name="notes" rows={3}/></label>
      <div className="request-total"><span>Service fee</span><strong>Confirmed after review</strong></div>
      <Button type="submit" size="lg" disabled={busy}>{busy ? "Submitting..." : "Submit request"}</Button>
    </form>
  </section>;
}
