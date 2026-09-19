import { Link } from "@tanstack/react-router";
import { ChevronDown, Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, X, Youtube } from "lucide-react";
import { useState, type ReactNode } from "react";
import { assets, image } from "@/lib/site-assets";

const menu = [
  { label: "About Us", items: [["Our story", "/about-us/our-story"], ["Our team", "/about-us/our-team"], ["Milestones", "/about-us/milestones"], ["Infrastructure", "/post-harvest-infrastructure"], ["Skill Development Centre", "/about-us/skill-development-centre"], ["Investor Relation", "/investor-relation"]] },
  { label: "Products", items: [["Core Crops", "/products/core-crops"], ["Fresh Fruits", "/products/fresh-fruits"], ["Processed Foods", "/products/processed-fruits-and-vegetables"], ["Dry Fruits", "/products/dry-fruits"], ["Kitchen Culture", "/frozen-vegetables-wholesale-preservative-free-fruits"], ["BioActives", "/bio-actives"]] },
  { label: "Food Safety", items: [["Standards", "/food-safety/standards"], ["Traceability", "/food-safety/traceability"]] },
  { label: "Sustainability", items: [["Environment", "/sustainability/environment"], ["Transparency and Fair Equity", "/sustainability/transparency-and-fair-equity"]] },
  { label: "PR & Media", items: [["PR & Media", "/pr-media"], ["Blogs", "/blog"]] },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="site-nav">
      <Link to="/" aria-label="Sahyadri Farms home"><img className="brand-logo" src={image(assets.logo)} alt="Sahyadri Farms" /></Link>
      <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
        <Link to="/" className="nav-item">Home</Link>
        {menu.map((group) => <div className="nav-group" key={group.label}>
          <button className="nav-item nav-trigger">{group.label}<ChevronDown size={14} /></button>
          <div className="dropdown">{group.items.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
        </div>)}
        <a className="nav-item" href="/expert-association">Association with Experts</a>
        <a className="nav-item" href="/careers">Careers</a>
        <a className="nav-item" href="/experience-sahyadri">Experience Sahyadri</a>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-farm" style={{ backgroundImage: `url(${image(assets.footerFarm)})` }} />
    <div className="footer-grid content-width">
      <div><img className="footer-logo" src={image(assets.logo)} alt="Sahyadri Farms" /><h3>Contact us</h3><p>Sahyadri Farms Post Harvest Care Limited</p><p><MapPin size={17}/> Registered Office and Factory: Gat No 314/1, 314/2/1, A/p Mohadi, Taluka Dindori, District Nashik, Maharashtra 422207, India</p><p><Phone size={17}/> 1800 212 002 020</p><p><Mail size={17}/> info@sahyadrifarms.com</p></div>
      <div><h3>Featured links</h3><a href="/about-us/our-story">Our Story</a><a href="/about-us/our-team">Meet our Chairman</a><a href="/food-safety/standards">Food Safety Standards</a><a href="/careers">Careers</a><a href="/investors">Investors</a><a href="/bio-actives">BioActives</a></div>
      <div><h3>Help</h3><a href="/contact-us">Contact Us</a><a href="/csr">CSR</a><a href="/privacy-policy">Privacy Policy</a><a href="/terms-of-use">Terms of Use</a></div>
      <div><h3>Farmer App</h3><div className="store-badges"><img src={image(assets.playstore)} alt="Get it on Google Play"/><img src={image(assets.appstore)} alt="Download on the App Store"/></div><a href="https://app.setu.farm">Enterprise Login</a><img className="setu-logo" src={image(assets.setu)} alt="SetuVerified" /></div>
    </div>
    <div className="footer-bottom content-width"><span>© Sahyadri Farms Post Harvest Care Ltd.</span><span>FarmSetu Supply Chain Stack</span><div className="socials"><Facebook/><Instagram/><Youtube/><Linkedin/></div></div>
  </footer>;
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }