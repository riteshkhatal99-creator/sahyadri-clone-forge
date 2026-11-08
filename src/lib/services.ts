export type FieldDef = { name: string; label: string; type: "text" | "number" | "select" | "textarea"; options?: string[]; placeholder?: string; required?: boolean };
export type Category = "transaction" | "legal";
export type Service = { slug: string; category: Category; name: string; summary: string; fee: number | null };

export const services: Service[] = [
  { slug: "buying", category: "transaction", name: "Buying assistance", summary: "We shortlist, inspect and negotiate the right property for you.", fee: null },
  { slug: "selling", category: "transaction", name: "Selling", summary: "Pricing, marketing and buyer handling until the deal closes.", fee: null },
  { slug: "leasing", category: "transaction", name: "Leasing", summary: "Find verified tenants or the right lease for your space.", fee: null },
  { slug: "resale", category: "transaction", name: "Resale", summary: "End-to-end support for resale homes and transfer paperwork.", fee: null },
  { slug: "title-verification", category: "legal", name: "Title verification", summary: "Lawyer-checked chain of title and encumbrance search.", fee: null },
  { slug: "agreement-drafting", category: "legal", name: "Agreement drafting", summary: "Sale, lease and leave & licence agreements drafted and reviewed.", fee: null },
  { slug: "rera-registration", category: "legal", name: "RERA registration", summary: "Project and agent registration with your state RERA authority.", fee: null },
];

export const categoryInfo: Record<Category, { title: string; eyebrow: string; description: string }> = {
  transaction: { title: "Transaction services", eyebrow: "BUY · SELL · LEASE · RESALE", description: "Our team manages your property deal from first enquiry to final handover." },
  legal: { title: "Legal & compliance", eyebrow: "VERIFY · DRAFT · REGISTER", description: "Title checks, agreements and RERA filings handled by property law experts." },
};

export const fieldsByCategory: Record<Category, FieldDef[]> = {
  transaction: [
    { name: "location", label: "Location", type: "text", placeholder: "Locality, city", required: true },
    { name: "property_type", label: "Property type", type: "select", options: ["Apartment", "Villa", "Plot", "Office", "Shop", "Warehouse"], required: true },
    { name: "carpet_area", label: "Carpet area (sq.ft.)", type: "number", required: true },
    { name: "possession_status", label: "Possession status", type: "select", options: ["Ready to move", "Under construction", "New launch"], required: true },
    { name: "expected_price", label: "Expected price (₹)", type: "number", required: true },
  ],
  legal: [
    { name: "document_type", label: "Document type", type: "select", options: ["Sale deed", "Agreement to sell", "Lease deed", "Gift deed", "Power of attorney", "RERA application"], required: true },
    { name: "stamp_duty_value", label: "Stamp duty value (₹)", type: "number", required: true },
    { name: "sub_registrar_office", label: "Sub-Registrar office", type: "text", placeholder: "e.g. Shivajinagar, Bengaluru", required: true },
    { name: "party_names", label: "Party names", type: "textarea", placeholder: "Names of all buyers, sellers or parties", required: true },
  ],
};

export const requestStatuses = ["awaiting_payment", "submitted", "in_review", "in_progress", "completed"] as const;
export const statusLabel: Record<string, string> = {
  awaiting_payment: "Awaiting payment", submitted: "Submitted", in_review: "In review", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled",
};

export function getService(slug: string) { return services.find((s) => s.slug === slug); }
export function inr(value: number) { return `₹${Number(value).toLocaleString("en-IN")}`; }

// Auction rules (mirrors public.place_bid in the database).
export type AuctionState = { reserve_price: number; bid_step: number; current_price: number; bid_count: number; starts_at: string; ends_at: string; extension_minutes: number };
export function minNextBid(a: AuctionState) { return a.bid_count === 0 ? a.reserve_price : a.current_price + a.bid_step; }
export function validateBid(a: AuctionState, amount: number, emdPaid: boolean, now = new Date()): string | null {
  if (now < new Date(a.starts_at)) return "Auction has not started yet";
  if (now > new Date(a.ends_at)) return "Auction has ended";
  if (!emdPaid) return "Pay the EMD before bidding";
  if (amount < minNextBid(a)) return `Minimum bid is ${inr(minNextBid(a))}`;
  return null;
}
export function extendedEnd(a: AuctionState, now = new Date()) {
  const end = new Date(a.ends_at);
  const windowMs = a.extension_minutes * 60000;
  return end.getTime() - now.getTime() < windowMs ? new Date(now.getTime() + windowMs) : end;
}
export function auctionPhase(a: Pick<AuctionState, "starts_at" | "ends_at">, now = new Date()) {
  if (now < new Date(a.starts_at)) return "upcoming";
  if (now > new Date(a.ends_at)) return "ended";
  return "live";
}
