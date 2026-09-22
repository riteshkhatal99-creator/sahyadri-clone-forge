import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
const description="Access saved properties, enquiries and your owner dashboard.";
export const Route=createFileRoute("/login")({head:()=>({meta:[{title:"Sign In | ZameenDhan"},{name:"description",content:description},{property:"og:title",content:"Sign In | ZameenDhan"},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=> <InfoPage eyebrow="SIGN IN" title="Welcome back" description={description} body="Account access will be available when secure user accounts are connected. You can continue browsing all current listings without signing in."/>});
