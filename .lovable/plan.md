# ZameenDhan Property Services Platform

## Goal
Turn ZameenDhan from a listing site into a property services platform for owners, buyers, and builders/developers. Your team handles every service request. Live online auctions get their own section. Keep the current blue theme and page arrangement style.

## Services offered
**Transaction Services** — Buying, Selling, Leasing, Resale
Request form fields: Location, Property Type, Carpet Area, Possession Status, Expected Price

**Legal & Compliance** — Title Verification, Agreement Drafting, RERA Registration
Request form fields: Document Type, Stamp Duty Value, Sub-Registrar Office, Party Names, plus document upload

**Auction** — live online bidding on properties

## What will be built
1. **New home page**: explains the three service groups, how it works (Request, Pay, Our team works, Done), and has a "Book a service" button. The old listing search moves to a smaller section.
2. **Services pages**: one page per group, with service cards and a fixed price shown for each service.
3. **Service request flow**: pick a service, fill in its form, pay the service fee, then get a request number.
4. **Customer dashboard**: My requests, with a status timeline (Submitted, In review, In progress, Completed), messages and files from your team, plus My bids and My auction deposits.
5. **Team (admin) panel**: only for your staff. See all requests, change status, add notes and upload files, create and manage auctions, and see payments.
6. **Auctions, run the iQuippo way**:
   - Auction page with photos, reserve price, bid step, start and end time, and documents
   - Before bidding, the buyer pays a refundable **Earnest Money Deposit (EMD)**
   - Live bidding with real-time price updates and a countdown. A bid placed in the final minutes extends the timer.
   - The winner pays the balance within a set deadline. Losing bidders' EMDs are marked for refund.
7. **Account types** at sign-up: Owner/Buyer or Builder/Developer.

## Payments
- Pay per service: one fixed fee for each service request.
- Auctions: an EMD to join, then the winner pays the balance.
- After you approve this plan, I'll check which payment provider can be used for an India-based business, then set it up in test mode first.

## Questions for you, before or after approval
- The price of each service, and the EMD amount (a fixed amount or a % of the reserve price). I'll show placeholder prices that are clearly marked until you give me the real ones.
- Should the existing property listings stay as a secondary feature, or be removed?

## Technical details
- New tables: services (catalog + price), service_requests (form data as JSON, status), request_updates (team notes and files), auctions, auction_registrations (EMD status), bids, payments, user_roles (admin) with a has_role() function.
- Admin access is enforced through user_roles and RLS. Bids go through a server function that validates the bid step, the auction window, and EMD status, and handles the anti-sniping extension.
- Real-time bid updates come from realtime subscriptions on bids/auctions.
- Request documents go in a private storage bucket, accessed with signed URLs.
- Tests cover the bid rules: minimum increment, EMD required, time-window, and extension.
