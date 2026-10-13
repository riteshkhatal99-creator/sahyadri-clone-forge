import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryInfo, inr, services, type Category } from "@/lib/services";
import { serviceGuidance, serviceQuestions } from "@/lib/service-guidance";
import { ServiceFaq } from "@/components/service-faq";

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
    <Link to="/" className="back-link">Home / Services</Link>
    <p className="eyebrow">{info.eyebrow}</p><h1>{info.title}</h1><p className="lead">{info.description}</p>
    <div className="service-notice"><strong>Before you book</strong><p>Choose the service that fits your property task. Review the scope below, then share your details. Prices are indicative and online payment is not connected; confirm the final fee and scope before paying.</p></div>
    <div className="service-cards">
      {services.filter((s) => s.category === category).map((s) => <article key={s.slug} className="service-card">
        <h3>{s.name}</h3><p>{s.summary}</p>
        <small>SUITABLE FOR</small><p>{serviceGuidance[s.slug]?.forWhom}</p>
        <h4>Request scope</h4><ul className="scope-list">{serviceGuidance[s.slug]?.scope.map((item) => <li key={item}>{item}</li>)}</ul>
        <details className="service-preparation"><summary>What to prepare & expected outcome</summary><p><b>Prepare:</b> {serviceGuidance[s.slug]?.prepare}</p><p><b>Outcome:</b> {serviceGuidance[s.slug]?.outcome}</p></details>
        <div className="service-card-foot"><div><small>Indicative fee · not final</small><strong>{inr(s.fee)}</strong></div><Button asChild><Link to="/request/$service" params={{ service: s.slug }}>Start request <ArrowRight size={16}/></Link></Button></div>
      </article>)}
    </div>
    <p className="fine-print">Fees shown are per request and are placeholders until final pricing is confirmed.</p>
    <ServiceFaq items={serviceQuestions}/>
  </section>;
}
