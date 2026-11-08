import { describe, expect, it } from "vitest";
import { extendedEnd, minNextBid, validateBid, type AuctionState } from "./services";
import { services } from "./services";

const base: AuctionState = { reserve_price: 5000000, bid_step: 50000, current_price: 0, bid_count: 0, starts_at: "2026-10-01T10:00:00Z", ends_at: "2026-10-01T12:00:00Z", extension_minutes: 5 };
const during = new Date("2026-10-01T11:00:00Z");

describe("auction bidding rules", () => {
  it("first bid must meet reserve price", () => {
    expect(minNextBid(base)).toBe(5000000);
    expect(validateBid(base, 4999999, true, during)).toMatch(/Minimum bid/);
  });
  it("later bids must add at least one bid step", () => {
    const a = { ...base, current_price: 5000000, bid_count: 1 };
    expect(minNextBid(a)).toBe(5050000);
    expect(validateBid(a, 5040000, true, during)).toMatch(/Minimum bid/);
    expect(validateBid(a, 5050000, true, during)).toBeNull();
  });
  it("EMD must be paid before bidding", () => {
    expect(validateBid(base, 5000000, false, during)).toBe("Pay the EMD before bidding");
  });
  it("bids only allowed during auction window", () => {
    expect(validateBid(base, 5000000, true, new Date("2026-10-01T09:00:00Z"))).toBe("Auction has not started yet");
    expect(validateBid(base, 5000000, true, new Date("2026-10-01T12:01:00Z"))).toBe("Auction has ended");
  });
  it("bid in final minutes extends the end time", () => {
    const now = new Date("2026-10-01T11:58:00Z");
    expect(extendedEnd(base, now).toISOString()).toBe("2026-10-01T12:03:00.000Z");
    expect(extendedEnd(base, during).toISOString()).toBe("2026-10-01T12:00:00.000Z");
  });
});

describe("service pricing", () => {
  it("does not publish invented fees before the business supplies real prices", () => {
    expect(services.map((service) => service.fee)).toEqual([null, null, null, null, null, null, null]);
  });
});
