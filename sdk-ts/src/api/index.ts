import { Connection } from "@solana/web3.js";
import { PUBLIC_CONFIG, ALPHA_CONFIG } from "../constants";
import { PriceInfo } from "../utils/PriceInfo";

export * from "./pool";
export * from "./portfolio";

export function getConnection(): Connection {
  return new Connection('https://apricot.genesysgo.net/', "confirmed");
}

export function getPriceInfo(env: string = "public"): PriceInfo {
  let config = env === "public" ? PUBLIC_CONFIG : ALPHA_CONFIG;
  return new PriceInfo(config);
}
