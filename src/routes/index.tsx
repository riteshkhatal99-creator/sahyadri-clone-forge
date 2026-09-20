import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { assets, certificationImages, clientImages, image } from "@/lib/site-assets";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sahyadri Farms - Seeding Goodness" },
    { name: "description", content: "India's Leading Integrated Fruits and Vegetables value chain." },
    { property: "og:title", content: "Sahyadri Farms - Seeding Goodness" },
    { property: "og:description", content: "India's Leading Integrated Fruits and Vegetables value chain." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const stats = [["30,000+","Registered farmers"],["45,000+","Acres of land"],["252+","Villages covered"],["46+","Countries served"],["4,000+","Customers worldwide"],["15+","Years in the industry"]];
  const pillars = [
    ["Largest integrated value chain","It's our equity and compensation policies, our promises to customers, or use of state-of-the-art technologies to make trust tangible, Sahyadri Farms has been leading the way on all fronts."],
    ["Farm-to-fork traceability","Our farmers see what happens with their produce after it leaves their farm, and our consumers see details about their food, their farmer, and what happens with the money they pay."],
    ["Safety and hygiene","At Sahyadri Farms, we ensure that we remain updated with the latest health norms. We follow global food safety standards at every step."],
    ["Farmer-led initiative","Sahyadri Farms is an initiative fully led and managed by farmers who have complete understanding of the problems faced by small-landholding farmers."],
  ];
  return <div className="home-page">
    <section className="home-hero" style={{ backgroundImage: `url(${image(assets.hero)})` }}>
      <div className="hero-shade"/><div className="hero-copy content-width"><p className="hero-kicker">SEEDING GOODNESS</p><h1>India's Largest Integrated Fruits and Vegetables Value Chain</h1><p>A company of the farmers, by the farmers and for the farmers.</p><a className="primary-button" href="/about-us/our-story">Know More <ArrowRight size={18}/></a></div>
    </section>
    <section className="stats-section content-width"><h2>Welcome to Sahyadri Farms</h2><div className="stats-grid">{stats.map(([n,l],i)=><article className="stat" key={l}><img src={image(assets.stats.at(i) ?? assets.hero)} alt=""/><strong>{n}</strong><span>{l}</span></article>)}</div></section>
    <section className="about-section"><div className="content-width split"><img src={image(assets.about)} alt="Aerial view of Sahyadri Farms"/><div><p className="eyebrow">WHO WE ARE</p><h2>About Sahyadri Farms</h2><p>Sahyadri is India’s largest integrated platform for fruits and vegetables. Through its unique inclusive partnership with farmers, the company has built strong capabilities in primary processing, frozen and aseptic foods, fruit products and waste processing under an integrated zero-discharge facility.</p><p>Sahyadri Farms began with the mission to ensure that small-landholding farmers of India receive fair compensation for their produce and labour, while following global agricultural and food-safety standards.</p><a className="primary-button" href="/about-us/our-story">Our Story <ArrowRight size={18}/></a></div></div></section>
    <section className="infra-section content-width"><h2>Infrastructure and Technology</h2><div className="feature-grid"><article style={{backgroundImage:`url(${image(assets.infrastructure)})`}}><div><h3>Infrastructure</h3><p>Visit our world-class infrastructure at Mohadi, Nashik, with state-of-the-art facilities designed for scale, safety and quality.</p><a href="/post-harvest-infrastructure">Read More <ArrowRight size={18}/></a></div></article><article style={{backgroundImage:`url(${image(assets.grapes)})`}}><div><h3>Technology</h3><p>From monitoring growing practices to a real-time traceable supply chain, technology is encoded in our DNA.</p><a href="/food-safety/traceability">Read More <ArrowRight size={18}/></a></div></article></div></section>
    <section className="pillars-section"><div className="content-width"><h2>Pillars of Sahyadri Farms</h2><div className="pillars-grid">{pillars.map(([h,p],i)=><article key={h}><img src={image(assets.pillars.at(i) ?? assets.logo)} alt=""/><h3>{h}</h3><p>{p}</p></article>)}</div></div></section>
    <section className="logo-section content-width"><h2>Our Licences and Certifications</h2><div className="logo-grid certifications">{certificationImages.map((src,i)=><img src={src} alt={`Certification ${i+1}`} key={src}/>)}</div></section>
    <section className="customers-section"><div className="content-width"><h2>Our Esteemed Customers</h2><div className="logo-grid customers">{clientImages.map((src,i)=><img src={src} alt={`Customer ${i+1}`} key={src}/>)}</div></div></section>
    <section className="news-section content-width"><h2>What's New</h2><div className="news-grid"><article><img src={image(assets.grapes)} alt="Grapes at Sahyadri Farms"/><div><span>NEWS</span><h3>Building a farmer-led future through technology and trust</h3><a href="/pr-media">Explore News <ArrowRight size={18}/></a></div></article><article className="video-card" style={{backgroundImage:`url(${image(assets.about)})`}}><a href="https://www.youtube.com/@SahyadriFarms" aria-label="Watch Sahyadri Farms video"><Play size={30}/></a><h3>Experience Sahyadri Farms</h3></article></div></section>
    <section className="careers"><div className="content-width"><div><p>GROW WITH US</p><h2>Careers</h2><span>Join a team driven by innovation, sustainability, and farmer prosperity.</span></div><a className="light-button" href="/careers">Apply Now <ArrowRight size={18}/></a></div></section>
  </div>;
}
