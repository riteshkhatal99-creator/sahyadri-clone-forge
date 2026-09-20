import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Building2, Heart, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/properties";
import { Button } from "@/components/ui/button";

export function PropertyCard({ property }: { property: Property }) {
  return <article className="property-card">
    <div className="property-media">
      <img src={property.image} alt={property.title} loading="lazy" width={1280} height={912}/>
      <span className="listing-badge">Owner listed</span>
      <Button variant="secondary" size="icon" className="save-button" aria-label={`Save ${property.title}`}><Heart size={18}/></Button>
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
