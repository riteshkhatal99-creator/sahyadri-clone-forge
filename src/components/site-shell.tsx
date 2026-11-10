import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Facebook, Instagram, LayoutDashboard, Linkedin, LogOut, Mail, MapPin, Menu, Phone, X, Youtube } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { supabase } from "@/integrations/supabase/client";

function Brand() {
  return <span className="brand" aria-label="Property24"><span className="brand-mark"><span/></span><strong>Property</strong><b>24</b></span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const signOut = async () => { await supabase.auth.signOut(); close(); navigate({ to: "/" }); };
  return <header className="site-header">
    <div className="site-nav">
      <Link to="/" onClick={close}><Brand/></Link>
      <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
        <Link to="/services/$category" params={{ category: "transaction" }} onClick={close}>Transactions</Link>
        <Link to="/services/$category" params={{ category: "legal" }} onClick={close}>Legal & Compliance</Link>
        <Link to="/auctions" onClick={close}>Auctions</Link>
        <Link to="/properties" search={{ purpose: "Buy" }} onClick={close}>Properties</Link>
        <Link to="/about" onClick={close}>About</Link>
        {user && <Link to="/dashboard" onClick={close}>My requests</Link>}
        {isAdmin && <Link to="/admin" onClick={close}>Team panel</Link>}
      </nav>
      <div className="nav-actions">
        {user
          ? <>
              <Button asChild variant="outline" className="login-button"><Link to="/dashboard"><LayoutDashboard size={16}/>My requests</Link></Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out"><LogOut size={17}/></Button>
            </>
          : <Button asChild variant="outline" className="login-button"><Link to="/login">Sign in</Link></Button>}
        <Button asChild className="post-button"><Link to="/services/$category" params={{ category: "transaction" }}>Book a service</Link></Button>
      </div>
      <Button variant="ghost" size="icon" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X/> : <Menu/>}</Button>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-cta"><div className="content-width"><div><p>YOUR NEXT PROPERTY STEP</p><h2>Find the right service for your property.</h2></div><Button asChild variant="secondary"><Link to="/services/$category" params={{ category: "transaction" }}>Explore services</Link></Button></div></div>
    <div className="footer-grid content-width">
    <div><Brand/><p className="footer-intro">Property transaction, legal & compliance and auction services across India.</p><p><MapPin size={17}/> Bengaluru, Karnataka, India</p><p><Phone size={17}/> 1800 309 2233</p><p><Mail size={17}/> hello@zameendhan.in</p></div>
      <div><h3>Services</h3><Link to="/services/$category" params={{ category: "transaction" }}>Transaction services</Link><Link to="/services/$category" params={{ category: "legal" }}>Legal & compliance</Link><Link to="/auctions">Property auctions</Link><Link to="/properties" search={{ purpose: "Buy" }}>Browse properties</Link></div>
      <div><h3>Company</h3><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of use</Link></div>
      <div><h3>Your account</h3><p>Keep your requests, shared documents and team conversations together.</p><Button asChild variant="outline" className="footer-outline"><Link to="/dashboard">My requests</Link></Button></div>
    </div>
    <div className="footer-bottom content-width"><span>© 2026 Property24. All rights reserved.</span><span>Made for India's property seekers</span><div className="socials"><Facebook/><Instagram/><Youtube/><Linkedin/></div></div>
  </footer>;
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }
