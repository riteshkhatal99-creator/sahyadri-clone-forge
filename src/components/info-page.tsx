import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InfoPage({ eyebrow, title, description, body }: { eyebrow: string; title: string; description: string; body: string }) {
  return <><section className="page-banner"><div className="content-width"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></section><section className="info-body content-width"><p>{body}</p><Button asChild><Link to="/properties" search={{ purpose: "Buy" }}>Explore properties <ArrowRight/></Link></Button></section></>;
}
