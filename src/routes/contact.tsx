import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
const description="Speak with our team about a listing, search or account question.";
export const Route=createFileRoute("/contact")({head:()=>({meta:[{title:"Contact ZameenDhan"},{name:"description",content:description},{property:"og:title",content:"Contact ZameenDhan"},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=> <InfoPage eyebrow="CONTACT US" title="We're here to help" description={description} body="Call us on 1800 309 2233 from 9:00 AM to 7:00 PM, Monday to Saturday, or email hello@zameendhan.in. We aim to respond within one working day."/>});
