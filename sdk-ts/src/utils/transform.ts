import { Decimal } from 'decimal.js';
import { TokenID, PoolFlag } from "../types"
import { DECIMAL_MULT } from "../constants/configs";
import invariant from "tiny-invariant";

export function epochToDate(time: Decimal) {
  return new Date(time.toNumber() * 1000);
}

export function flagsToBool(flags: number, targetFlag: PoolFlag): boolean {
  return Boolean(flags & targetFlag);
}

export function nativeAmountToTokenAmount(tokenId: TokenID, amount: Decimal): Decimal {
  return amount.div(DECIMAL_MULT[tokenId]);
}

export function tokenAmountToNativeAmount(tokenId: TokenID, amount: Decimal): Decimal {
  return amount.mul(DECIMAL_MULT[tokenId]);
}

export function nativeRateToTokenRate(
  rate: Decimal, nTokenId: TokenID, dTokenId: TokenID,
): Decimal {
  return nativeAmountToTokenAmount(nTokenId, rate)
    .div(nativeAmountToTokenAmount(dTokenId, Decimal.abs(1)));
}

export function tokenRateToNativeRate(
  rate: Decimal, nTokenId: TokenID, dTokenId: TokenID,
): Decimal {
  return tokenAmountToNativeAmount(nTokenId, rate)
  .div(tokenAmountToNativeAmount(dTokenId, Decimal.abs(1)));
}
export function nativeAmountToValue(
  tokenId: TokenID, amount: Decimal, price: Decimal.Value
): Decimal {
  return nativeAmountToTokenAmount(tokenId, amount).mul(price);
}

export function tokenRateToValueRate(
  rate: Decimal, nTokenPrice: Decimal.Value, dTokenPrice: Decimal.Value,
) {
  if (Decimal.abs(dTokenPrice).isZero()) {
    throw new Error(`Token price to be divided can't be zero.`);
  }

  return rate.mul(nTokenPrice).div(dTokenPrice);
}

export function nativeRateToValueRate(
  rate: Decimal, nTokenId: TokenID, dTokenId: TokenID,
  nTokenPrice: Decimal.Value, dTokenPrice: Decimal.Value,
): Decimal {
  return tokenRateToValueRate(
    nativeRateToTokenRate(rate, nTokenId, dTokenId), nTokenPrice, dTokenPrice
  );
}

export function rewindAmount(amount: Decimal, index: Decimal) {
  invariant(index.greaterThanOrEqualTo(1), `Invalid index: ${index}. Index must >= 1`);
  return amount.div(index);
}

export function fastForwardAmount(amount: Decimal, index: Decimal) {
  invariant(index.greaterThanOrEqualTo(1), `Invalid index: ${index}. Index must >= 1`);
  return amount.mul(index);
}

export function currentPerPastRateToCurrentPerCurrentRate(rate: Decimal, index: Decimal) {
  return rate.div(fastForwardAmount(Decimal.abs(1), index));
}
