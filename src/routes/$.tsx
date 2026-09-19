import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { assets, image } from "@/lib/site-assets";

const pages: Record<string, { title: string; eyebrow: string; description: string }> = {
  "about-us/our-story": { title: "Our Story", eyebrow: "ABOUT US", description: "A farmer-led journey built on fair compensation, world-class practices and the belief that goodness grows when everyone prospers." },
  "about-us/our-team": { title: "Our Team", eyebrow: "ABOUT US", description: "Meet the farmer leaders, professionals and partners shaping India’s largest integrated fruits and vegetables value chain." },
  "about-us/milestones": { title: "Milestones", eyebrow: "ABOUT US", description: "From a farmer collective in Nashik to a globally trusted integrated value chain." },
  "post-harvest-infrastructure": { title: "Post Harvest Infrastructure", eyebrow: "INFRASTRUCTURE", description: "State-of-the-art facilities built for scale, food safety, quality and complete value-chain integration." },
  "about-us/skill-development-centre": { title: "Skill Development Centre", eyebrow: "INFRASTRUCTURE", description: "Sharing practical knowledge and modern agricultural skills with farmers and future leaders." },
  "investor-relation": { title: "Investor Relation", eyebrow: "SAHYADRI FARMS", description: "Corporate information and resources for the Sahyadri Farms investor community." },
  "products/core-crops": { title: "Core Crops", eyebrow: "OUR PRODUCTS", description: "High-quality produce cultivated through responsible farming, precision practices and complete traceability." },
  "products/fresh-fruits": { title: "Fresh Fruits", eyebrow: "OUR PRODUCTS", description: "Fresh, safe and traceable fruits grown by our farmer community for customers across the world." },
  "products/processed-fruits-and-vegetables": { title: "Processed Foods", eyebrow: "OUR PRODUCTS", description: "World-class processing preserves freshness, flavour and nutrition from farm to final product." },
  "products/dry-fruits": { title: "Dry Fruits", eyebrow: "OUR PRODUCTS", description: "Carefully processed products made to exacting standards of quality, consistency and food safety." },
  "frozen-vegetables-wholesale-preservative-free-fruits": { title: "Kitchen Culture", eyebrow: "OUR PRODUCTS", description: "Convenient, preservative-free frozen fruits and vegetables from a fully traceable supply chain." },
  "bio-actives": { title: "BioActives", eyebrow: "INNOVATION", description: "Creating high-value natural ingredients through science, circularity and responsible processing." },
  "food-safety/standards": { title: "Food Safety Standards", eyebrow: "FOOD SAFETY", description: "Global systems, certifications and rigorous controls protect quality at every stage." },
  "food-safety/traceability": { title: "Farm-to-Fork Traceability", eyebrow: "FOOD SAFETY", description: "Transparent digital systems connect every product with its farmer, field and journey." },
  "sustainability/environment": { title: "Environment", eyebrow: "SUSTAINABILITY", description: "Responsible water, energy and waste practices help agriculture thrive for generations." },
  "sustainability/transparency-and-fair-equity": { title: "Transparency and Fair Equity", eyebrow: "SUSTAINABILITY", description: "A value chain designed to create trust, visibility and equitable returns for farmers." },
  "expert-association": { title: "Association with Experts", eyebrow: "COLLABORATION", description: "Working with leading specialists to advance agriculture, food technology and farmer prosperity." },
  "careers": { title: "Careers", eyebrow: "GROW WITH US", description: "Build a meaningful career with a team driven by innovation, sustainability and positive impact in agriculture." },
  "experience-sahyadri": { title: "Experience Sahyadri", eyebrow: "VISIT US", description: "See how farms, people, technology and world-class infrastructure come together at Sahyadri Farms." },
  "pr-media": { title: "PR & Media", eyebrow: "LATEST UPDATES", description: "News, announcements and stories from across the Sahyadri Farms community." },
  "blog": { title: "Blogs", eyebrow: "INSIGHTS", description: "Ideas and stories about farming, food, technology, sustainability and farmer-led progress." },
  "contact-us": { title: "Contact Us", eyebrow: "GET IN TOUCH", description: "Connect with Sahyadri Farms for products, partnerships, visits and general enquiries." },
  "csr": { title: "CSR", eyebrow: "COMMUNITY", description: "Supporting resilient rural communities through meaningful, long-term initiatives." },
  "privacy-policy": { title: "Privacy Policy", eyebrow: "SAHYADRI FARMS", description: "How Sahyadri Farms handles and protects information shared through its website and services." },
  "terms-of-use": { title: "Terms of Use", eyebrow: "SAHYADRI FARMS", description: "Terms governing the use of the Sahyadri Farms website and digital services." },
};

export const Route = createFileRoute("/$")({
  head: ({ params }) => {
    const page = pages[params._splat ?? ""] ?? { title: "Sahyadri Farms", description: "India's leading integrated fruits and vegetables value chain." };
    return { meta: [
      { title: `${page.title} | Sahyadri Farms` },
      { name: "description", content: page.description },
      { property: "og:title", content: `${page.title} | Sahyadri Farms` },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: ContentPage,
});

function ContentPage() {
  const { _splat } = Route.useParams();
  const page = pages[_splat ?? ""];
  if (!page) return <section className="simple-page"><div className="content-width"><p className="eyebrow">SAHYADRI FARMS</p><h1>Page not found</h1><Link className="primary-button" to="/"><ArrowLeft size={18}/> Back to Home</Link></div></section>;
  return <>
    <section className="interior-hero" style={{ backgroundImage: `url(${image(assets.hero)})` }}><div className="hero-shade"/><div className="content-width"><p>{page.eyebrow}</p><h1>{page.title}</h1></div></section>
    <section className="interior-body content-width"><div><p className="eyebrow">SEEDING GOODNESS</p><h2>{page.title}</h2><p>{page.description}</p><p>Sahyadri Farms works through an inclusive partnership with farmers, combining agricultural knowledge, advanced infrastructure, technology and global food-safety practices. Every part of the value chain is built to deliver quality to customers and lasting value to farming communities.</p><Link className="primary-button" to="/">Explore Sahyadri Farms <ArrowRight size={18}/></Link></div><img src={image(assets.about)} alt="Sahyadri Farms campus and facilities"/></section>
  </>;
}