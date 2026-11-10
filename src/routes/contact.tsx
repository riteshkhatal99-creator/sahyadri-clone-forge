import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
const description="Speak with our team about a property service request or auction.";
export const Route=createFileRoute("/contact")({head:()=>({meta:[{title:"Contact Property24"},{name:"description",content:description},{property:"og:title",content:"Contact Property24"},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=> <InfoPage eyebrow="CONTACT US" title="We're here to help" description={description} body="For an existing service request, sign in and message the Property24 team from My requests. Official public contact details will be added once confirmed."/>});
