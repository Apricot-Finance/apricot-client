export * from "./StructParser";

export function assert(cond: boolean, msg?: string): asserts cond {
  if(!cond) {
    throw new Error(msg);
  }
}
