export * from "./AccountParser";
export * from "./TransactionBuilder";
export * from "./ActionWrapper";
export * from "./PriceInfo";

export function assert(cond: boolean, msg?: string): asserts cond {
  if(!cond) {
    throw new Error(msg);
  }
}
