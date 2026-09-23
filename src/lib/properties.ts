import { supabase } from "@/integrations/supabase/client";
import apartmentImage from "@/assets/property-apartment.jpg";
import villaImage from "@/assets/property-villa.jpg";
import officeImage from "@/assets/property-office.jpg";
import mumbaiImage from "@/assets/property-mumbai.jpg";

export type Property = {
  id: string;
  title: string;
  city: string;
  locality: string;
  type: string;
  purpose: string;
  price: string;
  priceValue: number;
  beds: number;
  baths: number;
  area: number;
  image: string;
  imageKey?: string | null;
  imagePath?: string | null;
  description: string;
  amenities: string[];
  featured?: boolean;
  ownerId?: string | null;
  createdAt?: string;
};

export type PropertyRow = {
  id: string;
  owner_id: string | null;
  title: string;
  city: string;
  locality: string;
  type: string;
  purpose: string;
  price_display: string;
  price_value: number;
  beds: number;
  baths: number;
  area: number;
  image_key: string | null;
  image_path: string | null;
  description: string;
  amenities: string[];
  status: string;
  featured: boolean;
  created_at: string;
};

export const cities = ["Bengaluru", "Mumbai", "Pune", "Hyderabad", "Delhi", "Gurugram"];

const localImages: Record<string, string> = {
  apartment: apartmentImage,
  villa: villaImage,
  office: officeImage,
  mumbai: mumbaiImage,
};

export function fallbackImage(key?: string | null) {
  return localImages[key ?? ""] ?? apartmentImage;
}

export function formatPrice(value: number, purpose: string) {
  const monthly = purpose === "Rent" || purpose === "Commercial";
  if (monthly) return `₹${value.toLocaleString("en-IN")} / month`;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

async function resolveImage(row: PropertyRow): Promise<string> {
  if (row.image_path) {
    const { data } = await supabase.storage.from("property-photos").createSignedUrl(row.image_path, 3600);
    if (data?.signedUrl) return data.signedUrl;
  }
  return fallbackImage(row.image_key);
}

function mapRow(row: PropertyRow, image: string): Property {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    locality: row.locality,
    type: row.type,
    purpose: row.purpose,
    price: row.price_display,
    priceValue: row.price_value,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    image,
    imageKey: row.image_key,
    imagePath: row.image_path,
    description: row.description,
    amenities: row.amenities ?? [],
    featured: row.featured,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

async function mapRows(rows: PropertyRow[]) {
  return Promise.all(rows.map(async (row) => mapRow(row, await resolveImage(row))));
}

export async function listProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return mapRows((data ?? []) as unknown as PropertyRow[]);
}

export async function getProperty(id: string): Promise<Property | undefined> {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const row = data as unknown as PropertyRow;
  return mapRow(row, await resolveImage(row));
}

export async function listMyProperties(userId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return mapRows((data ?? []) as unknown as PropertyRow[]);
}
