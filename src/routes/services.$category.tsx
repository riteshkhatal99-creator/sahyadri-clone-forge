import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryInfo, inr, services, type Category } from "@/lib/services";

export const Route = createFileRoute("/services/$category")({
  loader: ({ params }) => {
    if (params.category !== "transaction" && params.category !== "legal") throw notFound();
    return { category: params.category as Category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Service not found | ZameenDhan" }, { name: "robots", content: "noindex" }] };
    const info = categoryInfo[loaderData.category];
    return { meta: [
      { title: `${info.title} | ZameenDhan` }, { name: "description", content: info.description },
      { property: "og:title", content: `${info.title} | ZameenDhan` }, { property: "og:description", content: info.description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  notFoundComponent: () => <section className="content-width empty-state"><h2>Service not found</h2><Link to="/">Go home</Link></section>,
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const info = categoryInfo[category];
  return <section className="content-width services-page">
    <p className="eyebrow">{info.eyebrow}</p><h1>{info.title}</h1><p className="lead">{info.description}</p>
    <div className="service-cards">
      {services.filter((s) => s.category === category).map((s) => <article key={s.slug} className="service-card">
        <h3>{s.name}</h3><p>{s.summary}</p>
        <div className="service-card-foot"><strong>{inr(s.fee)}</strong><Button asChild><Link to="/request/$service" params={{ service: s.slug }}>Request <ArrowRight size={16}/></Link></Button></div>
      </article>)}
    </div>
    <p className="fine-print">Fees shown are per request and are placeholders until final pricing is confirmed.</p>
  </section>;
}
