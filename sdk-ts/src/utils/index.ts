export * from "./StructParser";
export * from "./AccountParser";
export * from "./TransactionBuilder";
export * from "./ActionWrapper";

export function assert(cond: boolean, msg?: string): asserts cond {
  if(!cond) {
    throw new Error(msg);
  }
}
