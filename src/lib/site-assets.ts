import hero from "@/assets/reference/hero.jpg.asset.json";
import logo from "@/assets/reference/logo.svg.asset.json";
import about from "@/assets/reference/about.webp.asset.json";
import infrastructure from "@/assets/reference/infrastructure.webp.asset.json";
import grapes from "@/assets/reference/grapes.webp.asset.json";
import footerFarm from "@/assets/reference/farm-footer.webp.asset.json";
import statFarmers from "@/assets/reference/stat-farmers.webp.asset.json";
import statLand from "@/assets/reference/stat-land.webp.asset.json";
import statVillages from "@/assets/reference/stat-villages.webp.asset.json";
import statCountries from "@/assets/reference/stat-countries.webp.asset.json";
import statCustomers from "@/assets/reference/stat-customers.webp.asset.json";
import statYears from "@/assets/reference/stat-years.webp.asset.json";
import pillarChain from "@/assets/reference/pillar-chain.svg.asset.json";
import pillarTrace from "@/assets/reference/pillar-trace.svg.asset.json";
import pillarSafety from "@/assets/reference/pillar-safety.svg.asset.json";
import pillarFarmer from "@/assets/reference/pillar-farmer.svg.asset.json";
import playstore from "@/assets/reference/playstore.webp.asset.json";
import appstore from "@/assets/reference/appstore.webp.asset.json";
import setu from "@/assets/reference/setu.svg.asset.json";

type Asset = { url: string };
export const image = (asset: Asset) => asset.url;
export const assets = {
  hero, logo, about, infrastructure, grapes, footerFarm,
  stats: [statFarmers, statLand, statVillages, statCountries, statCustomers, statYears],
  pillars: [pillarChain, pillarTrace, pillarSafety, pillarFarmer],
  playstore, appstore, setu,
};

export const certificationImages = Object.values(
  import.meta.glob<{ default: Asset }>("@/assets/reference/cert-*.asset.json", { eager: true }),
).map((module) => module.default.url);

export const clientImages = Object.values(
  import.meta.glob<{ default: Asset }>("@/assets/reference/client-*.asset.json", { eager: true }),
).map((module) => module.default.url);