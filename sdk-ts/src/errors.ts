export class Errors {
  static exceptionToString(e: Error): string {
    const msg = e.message;
    if(msg.indexOf("custom program error") >= 0  && msg.indexOf("0x") >= 0) {
      const lastIdx = msg.lastIndexOf("0x");
      const errCode = msg.substr(lastIdx, 6);
      const code = parseInt(errCode);
      switch(code) {
      // error about accounts supplied
      case 0x1000: return "Internal error, incorrect base_pda account";
      case 0x1001: return "Internal error, incorrect user_pages_stats account";
      case 0x1002: return "Internal error, incorrect users_page account";
      case 0x1003: return "Internal error, incorrect user_info account";
      case 0x1004: return "Internal error, incorrect asset_pool account";
      case 0x1005: return "Internal error, incorrect asset_price account";
      case 0x1006: return "Internal error, incorrect asset_pool_spl account";
      case 0x1007: return "Internal error, incorrect user_asset_info account";
      case 0x1008: return "Internal error, missing active accounts";
      case 0x1009: return "Internal error, incorrect intermediate_spl account";
      case 0x100a: return "Internal error, incorrect collateral_market account";
      case 0x100b: return "Internal error, incorrect borrowed_market account";
      case 0x100c: return "Internal error, incorrect serum_program account";

      // error about instruction data
      case 0x2000: return "Internal error, missing page_id";
      case 0x2001: return "Internal error, page_id too large";
      case 0x2002: return "Internal error, missing amount";
      case 0x2003: return "Internal error, missing seed_str";
      case 0x2004: return "Internal error, missing acitve_seed_str";
      case 0x2005: return "Internal error, wrong instruction data size";

      // frontend error
      case 0x3000: return "Internal error, account already added. Should use deposit()";
      case 0x3001: return "Internal error, not enough available slots for chosen users_page";
      case 0x3002: return "Internal error, account not added. Should use add_user_and_deposit()";
      case 0x3003: return "Internal error, wallet did not sign";
      case 0x3004: return "Internal error, maximum number of pools reached";
      case 0x3005: return "User does not have this asset";

      // user error
      case 0x4000: return "Trying to deposit an amount amount less than minimum required. Please try depositing more.";
      case 0x4001: return "User cannot withdraw more than their deposit.";
      case 0x4002: return "Pool does not have enough funds for borrowing/withdrawal at the time.";
      case 0x4003: return "Please try withdrawing all remaining amount as after the current withdrawal, amount of deposit left will be less than minimum required";
      case 0x4004: return "User does not have enough borrowing power. Please deposit more assets as collateral.";
      case 0x4005: return "User cannot repay more than what he owes.";
      case 0x4006: return "This withdrawal failed because it will cause user's collateral ratio to fall below requirement.";
      case 0x4007: return "This account cannot be liquidated as it has not reached liquidation threshold yet";
      case 0x4008: return "Liquidator asked for too much collateral";
      case 0x4009: return "Liquidator tried to repay more than what the user owes";
      case 0x400a: return "Liquidator asked for more collateral than the user has";
      case 0x400b: return "Liquidation will lead to a collateral ratio that is too large. Try liquidating less.";
      case 0x400c: return "Self-liquidation threshold is too small"; // FIXME: how small is too small?
      case 0x400d: return "Post self-liquidation target ratio too small"; // FIXME: how small is too small?
      case 0x400e: return "Post external-liquidation target ratio too small"; // FIXME: how small is too small?
      case 0x400f: return "Self-liquidation threshold has not been reached yet"; // FIXME: how small is too small?
      case 0x4010: return "Self-liquidation target exceeded";
      case 0x4011: return "Self-liquidation led to too much slippage";
      case 0x4012: return "Exceeded maximum number of assets supported";
      case 0x4013: return "Bought less than min";
      case 0x4014: return "Asset not used as collateral";
      case 0x4015: return "User does not have enough balance in wallet for this operation.";
      }
      if (msg.indexOf("error: 0x2a") >= 0) {
        return "Test serum market saturated. Please ask Apricot dev to replenish ammo for serum market!";
      }
      if (msg.indexOf("error: 0x1") >= 0) {
        return "You do not have enough wallet balance for this action. (Are you trying to repay max? Do note that a little bit of interest might have accrued in this time.)";
      }
      console.log(e.toString());
      return "Internal error. Report this to our discord! Details: " + msg;
    }
    else if (msg.indexOf("invalid account data") >= 0) {
      return "User does not appear to have created an SPL account for this token.";
    }
    else if (msg.indexOf("found no record of a prior credit") >= 0) {
      return "Cannot proceed as user has no SOL in their main wallet.";
    }
    else {
      // not custom error, not sure what to do with them yet
      return msg;
    }
  }
}
