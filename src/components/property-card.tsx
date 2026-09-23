import { Link, useNavigate } from "@tanstack/react-router";
import { Bath, BedDouble, Building2, Heart, MapPin, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Property } from "@/lib/properties";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

function FavoriteButton({ property }: { property: Property }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { setSaved(false); return; }
    supabase.from("favorites").select("property_id").eq("property_id", property.id).eq("user_id", user.id)
      .maybeSingle().then(({ data }) => setSaved(!!data));
  }, [user, property.id]);

  const toggle = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    if (saved) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", property.id);
      setSaved(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, property_id: property.id });
      setSaved(true);
    }
  };

  return (
    <Button variant="secondary" size="icon" className="save-button" onClick={toggle}
      aria-label={saved ? `Remove ${property.title} from saved` : `Save ${property.title}`} aria-pressed={saved}>
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </Button>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  return <article className="property-card">
    <div className="property-media">
      <img src={property.image} alt={property.title} loading="lazy" width={1280} height={912}/>
      <span className="listing-badge">Owner listed</span>
      <FavoriteButton property={property}/>
    </div>
    <div className="property-content">
      <div className="property-heading"><div><span>{property.purpose} · {property.type}</span><h3>{property.title}</h3></div><strong>{property.price}</strong></div>
      <p className="property-location"><MapPin size={15}/>{property.locality}, {property.city}</p>
      <div className="property-facts">
        {property.beds > 0 && <span><BedDouble size={17}/>{property.beds} Beds</span>}
        <span><Bath size={17}/>{property.baths} Baths</span>
        <span><Maximize2 size={17}/>{property.area.toLocaleString("en-IN")} sq.ft.</span>
      </div>
      <Link to="/property/$id" params={{ id: property.id }} className="card-link">View property <Building2 size={17}/></Link>
    </div>
  </article>;
}
