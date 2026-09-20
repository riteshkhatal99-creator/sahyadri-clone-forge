import apartmentImage from "@/assets/property-apartment.jpg";
import villaImage from "@/assets/property-villa.jpg";
import officeImage from "@/assets/property-office.jpg";
import mumbaiImage from "@/assets/property-mumbai.jpg";

export type Property = {
  id: string;
  title: string;
  city: string;
  locality: string;
  type: "Apartment" | "Villa" | "Office";
  purpose: "Buy" | "Rent" | "Commercial";
  price: string;
  priceValue: number;
  beds: number;
  baths: number;
  area: number;
  image: string;
  featured?: boolean;
  description: string;
  amenities: string[];
};

export const properties: Property[] = [
  { id: "skyline-residences", title: "Skyline Residences", city: "Bengaluru", locality: "Whitefield", type: "Apartment", purpose: "Buy", price: "₹1.48 Cr", priceValue: 14800000, beds: 3, baths: 3, area: 1840, image: apartmentImage, featured: true, description: "A sunlit, owner-listed home with generous rooms, city views and easy access to Whitefield's business district.", amenities: ["Clubhouse", "Swimming pool", "Covered parking", "24×7 security", "Power backup", "Gym"] },
  { id: "palm-grove-villa", title: "Palm Grove Villa", city: "Pune", locality: "Baner", type: "Villa", purpose: "Buy", price: "₹2.85 Cr", priceValue: 28500000, beds: 4, baths: 4, area: 2960, image: villaImage, featured: true, description: "A private modern villa surrounded by mature greenery, designed for effortless indoor-outdoor family living.", amenities: ["Private garden", "Two-car parking", "Terrace", "Modular kitchen", "Pet friendly", "Security"] },
  { id: "sea-view-court", title: "Sea View Court", city: "Mumbai", locality: "Worli", type: "Apartment", purpose: "Rent", price: "₹92,000 / month", priceValue: 92000, beds: 2, baths: 2, area: 1120, image: mumbaiImage, featured: true, description: "A furnished high-floor home with open skyline views, contemporary interiors and excellent south Mumbai connectivity.", amenities: ["Furnished", "Sea view", "Reserved parking", "Concierge", "Gym", "Lift"] },
  { id: "vertex-business-suite", title: "Vertex Business Suite", city: "Gurugram", locality: "Golf Course Road", type: "Office", purpose: "Commercial", price: "₹2.15 L / month", priceValue: 215000, beds: 0, baths: 2, area: 3200, image: officeImage, featured: true, description: "A fully fitted premium office with boardroom, reception and flexible workspace for a growing team.", amenities: ["Fully fitted", "24×7 access", "Reception", "Meeting rooms", "Parking", "Metro nearby"] },
  { id: "greenwood-heights", title: "Greenwood Heights", city: "Hyderabad", locality: "Gachibowli", type: "Apartment", purpose: "Rent", price: "₹48,000 / month", priceValue: 48000, beds: 3, baths: 3, area: 1685, image: apartmentImage, description: "Spacious gated-community home close to the financial district, schools and everyday conveniences.", amenities: ["Gated society", "Pool", "Gym", "Play area", "Parking", "Power backup"] },
  { id: "gardenia-house", title: "Gardenia House", city: "Delhi", locality: "Vasant Kunj", type: "Villa", purpose: "Buy", price: "₹4.65 Cr", priceValue: 46500000, beds: 4, baths: 5, area: 3400, image: villaImage, description: "A quiet, independent residence with landscaped outdoor spaces in one of south Delhi's established neighbourhoods.", amenities: ["Private garden", "Staff room", "Parking", "Terrace", "Study", "Security"] },
];

export const cities = ["Bengaluru", "Mumbai", "Pune", "Hyderabad", "Delhi", "Gurugram"];
export const getProperty = (id: string) => properties.find((property) => property.id === id);
