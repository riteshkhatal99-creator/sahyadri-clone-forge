import { Link } from "@tanstack/react-router";
import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, X, Youtube } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

function Brand() {
  return <span className="brand" aria-label="ZameenDhan"><span className="brand-mark"><span/></span><strong>Zameen</strong><b>Dhan</b></span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="site-nav">
      <Link to="/" onClick={close}><Brand/></Link>
      <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
        <Link to="/properties" search={{ purpose: "Buy" }} onClick={close}>Buy</Link>
        <Link to="/properties" search={{ purpose: "Rent" }} onClick={close}>Rent</Link>
        <Link to="/commercial" onClick={close}>Commercial</Link>
        <Link to="/properties" search={{ purpose: "Buy", type: "Plot" }} onClick={close}>Plots</Link>
        <Link to="/about" onClick={close}>About</Link>
      </nav>
      <div className="nav-actions">
        <Button asChild variant="outline" className="login-button"><Link to="/login">Sign in</Link></Button>
        <Button asChild className="post-button"><Link to="/post-property">Post property free</Link></Button>
      </div>
      <Button variant="ghost" size="icon" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X/> : <Menu/>}</Button>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-cta"><div className="content-width"><div><p>LIST YOUR PROPERTY</p><h2>Find the right tenant or buyer, directly.</h2></div><Button asChild variant="secondary"><Link to="/post-property">Post property free</Link></Button></div></div>
    <div className="footer-grid content-width">
      <div><Brand/><p className="footer-intro">India's owner-first property marketplace for homes, plots and commercial spaces.</p><p><MapPin size={17}/> Bengaluru, Karnataka, India</p><p><Phone size={17}/> 1800 309 2233</p><p><Mail size={17}/> hello@zameendhan.in</p></div>
      <div><h3>Explore</h3><Link to="/properties" search={{ purpose: "Buy" }}>Buy a home</Link><Link to="/properties" search={{ purpose: "Rent" }}>Rent a home</Link><Link to="/commercial">Commercial</Link><Link to="/post-property">List property</Link></div>
      <div><h3>Company</h3><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of use</Link></div>
      <div><h3>Property owners</h3><p>Reach genuine buyers and tenants without paying brokerage.</p><Button asChild variant="outline" className="footer-outline"><Link to="/post-property">Start listing</Link></Button></div>
    </div>
    <div className="footer-bottom content-width"><span>© 2026 ZameenDhan. All rights reserved.</span><span>Made for India's property seekers</span><div className="socials"><Facebook/><Instagram/><Youtube/><Linkedin/></div></div>
  </footer>;
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }