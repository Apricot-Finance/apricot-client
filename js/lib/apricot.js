"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnWrapper = exports.TxMaker = exports.Parser = exports.Errors = exports.consts = exports.poolIdToLtv = exports.poolIdToMintStr = exports.pool_id_to_decimal_multiplier = exports.mints = exports.serumPubkey = exports.programPubkey = exports.serumPubkeyStr = exports.programPubkeyStr = void 0;

var S = _interopRequireWildcard(require("@solana/web3.js"));

var T = _interopRequireWildcard(require("@solana/spl-token"));

var _bigInteger = _interopRequireDefault(require("big-integer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var programPubkeyStr = "2XaNvhxnLjym7SY2y55fLVWAtnzRNpSzByVs61y4ANM5";
exports.programPubkeyStr = programPubkeyStr;
var serumPubkeyStr = "9NaBPcFZpHWj6p5sSbLSPEt85j5xev84Bq3HvhTNWq4c";
exports.serumPubkeyStr = serumPubkeyStr;
var programPubkey = new S.PublicKey(programPubkeyStr);
exports.programPubkey = programPubkey;
var serumPubkey = new S.PublicKey(serumPubkeyStr);
exports.serumPubkey = serumPubkey;
var mints = {
  fake_btc: "7MtysQGohtvxjV53ffV3BumvNaF7DHMC47QwPsDUE98f",
  fake_eth: "DQ6Vw2iFQ3jWYsT52TtUXkrBQfkuAu2rtCcWZZ5BtktY",
  fake_usdt: "GjJFUSzbjZZMXySmJ8jwYmYcZhosN4PAcBKDTnSpHd3s",
  fake_usdc: "BwNiXVdAYt5g5tGSn6Apadk72SEqzmEd3Tv2W5pgvWFM",
  fake_sol: "4jSAADAjfidWvkpRVBk4Q5LMiZT2UNyw8A3D3oKwBC2u",
  fake_usdt_usdc: "9R9MtiUGKwp3V8atf636X3nJc6KbCsJNGCFJcdPLeTu7",
  fake_ust: "G6V7e333pY2uQC9dN78euNvC9jpAMtsAdLZUddVjCy6d",
  fake_usdt_usdc_orca: "JCUUGC8DKggrCQJANxwFuki2Uu7Ypr4B1G7WXHW1wksu",
  fake_ust_usdc_saber: "HBu1cw7226zSyjkcnmH6P6DoHNLSgcs7XVqY641nrgEv"
};
exports.mints = mints;
var mint_key_str_to_pool_id = {};
mint_key_str_to_pool_id[mints.fake_btc] = 0;
mint_key_str_to_pool_id[mints.fake_eth] = 1;
mint_key_str_to_pool_id[mints.fake_usdt] = 2;
mint_key_str_to_pool_id[mints.fake_usdc] = 3;
mint_key_str_to_pool_id[mints.fake_sol] = 4;
mint_key_str_to_pool_id[mints.fake_usdt_usdc] = 5;
mint_key_str_to_pool_id[mints.fake_ust] = 6;
mint_key_str_to_pool_id[mints.fake_usdt_usdc_orca] = 7;
mint_key_str_to_pool_id[mints.fake_ust_usdc_saber] = 8;
var pool_id_to_decimal_multiplier = {
  0: 1e9,
  1: 1e9,
  2: 1e9,
  3: 1e9,
  4: 1e9,
  5: 1e9,
  6: 1e9,
  7: 1e9,
  8: 1e9
};
exports.pool_id_to_decimal_multiplier = pool_id_to_decimal_multiplier;
var poolIdToMintStr = {
  0: mints.fake_btc,
  // BTC
  1: mints.fake_eth,
  // ETH
  2: mints.fake_usdt,
  // USDT
  3: mints.fake_usdc,
  // USDC
  4: mints.fake_sol,
  // SOL
  5: mints.fake_usdt_usdc,
  // USDT-USDC LP
  6: mints.fake_ust,
  // UST
  7: mints.fake_usdt_usdc_orca,
  // USDT-USDC LP (Orca)
  8: mints.fake_ust_usdc_saber // UST-USDC LP (Saber)

};
exports.poolIdToMintStr = poolIdToMintStr;
var poolIdToLtv = {
  0: 0.85,
  // BTC
  1: 0.85,
  // ETH
  2: 0.91,
  // USDT
  3: 0.91,
  // USDC
  4: 0.80,
  // SOL
  5: 0.80,
  // USDT-USDC LP
  6: 0.80,
  // UST
  7: 0.80,
  // USDT-USDC LP (Orca)
  8: 0.80 // UST-USDC LP (Saber)

};
exports.poolIdToLtv = poolIdToLtv;
var devAccountKey = new S.PublicKey("7WjocgG2eHXx1P1L3WQtrSYQUPRZALzYxSM8pQ2xPSwU");

var consts = /*#__PURE__*/function () {
  function consts() {
    _classCallCheck(this, consts);
  }

  _createClass(consts, null, [{
    key: "get_base_pda",
    value: function get_base_pda() {
      return S.PublicKey.findProgramAddress(["2"], programPubkey);
    }
  }, {
    key: "get_price_pda",
    value: function get_price_pda() {
      return S.PublicKey.findProgramAddress(["PRICE"], programPubkey);
    }
  }, {
    key: "get_pool_list_key",
    value: function get_pool_list_key(base_pda) {
      return S.PublicKey.createWithSeed(base_pda, "PoolList", programPubkey);
    }
  }, {
    key: "get_pool_summaries_key",
    value: function get_pool_summaries_key() {
      return S.PublicKey.createWithSeed(devAccountKey, consts.POOL_SUMMARIES_SEED, programPubkey);
    }
  }, {
    key: "get_price_summaries_key",
    value: function get_price_summaries_key(base_pda) {
      return S.PublicKey.createWithSeed(base_pda, "PriceSummaries", programPubkey);
    }
  }, {
    key: "get_user_pages_stats_key",
    value: function get_user_pages_stats_key(base_pda) {
      return S.PublicKey.createWithSeed(base_pda, "UserPagesStats", programPubkey);
    }
  }, {
    key: "get_users_page_key",
    value: function get_users_page_key(base_pda, page_id) {
      return S.PublicKey.createWithSeed(base_pda, "UsersPage_" + page_id, programPubkey);
    }
  }, {
    key: "get_asset_pool_key",
    value: function get_asset_pool_key(base_pda, mint_key_str) {
      var pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
      return S.PublicKey.createWithSeed(base_pda, pool_seed_str, programPubkey);
    }
  }, {
    key: "get_asset_price_key",
    value: function get_asset_price_key(price_pda, mint_key_str) {
      var pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
      return S.PublicKey.createWithSeed(price_pda, pool_seed_str, programPubkey);
    }
  }, {
    key: "get_asset_pool_spl_key",
    value: function get_asset_pool_spl_key(base_pda, mint_key_str) {
      var pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
      return S.PublicKey.createWithSeed(base_pda, pool_seed_str, T.TOKEN_PROGRAM_ID);
    }
  }, {
    key: "get_user_info_key",
    value: function get_user_info_key(wallet_key) {
      return S.PublicKey.createWithSeed(wallet_key, "UserInfo", programPubkey);
    }
  }, {
    key: "get_price_key",
    value: function get_price_key(price_pda, mint_key_str) {
      if (use_pyth) {
        var coin_name = consts.mint_key_str_to_coin_name(mint_key_str);
        return new S.PublicKey(pythPriceKeys[coin_name]);
      } else {
        return consts.get_asset_price_key(price_pda, mint_key_str);
      }
    }
  }, {
    key: "mint_key_str_to_coin_name",
    value: function mint_key_str_to_coin_name(mint_key_str) {
      for (var key in mints) {
        if (mints[key] === mint_key_str) return key.substr(5).toUpperCase();
      }

      throw new Error();
    }
  }, {
    key: "pool_id_to_seed_str",
    value: function pool_id_to_seed_str(pool_id) {
      var char1 = String.fromCharCode(pool_id / 16 + 'a'.charCodeAt(0));
      var char2 = String.fromCharCode(pool_id % 16 + 'a'.charCodeAt(0));
      return "POOL__" + char1 + char2;
    }
  }, {
    key: "mint_key_str_to_pool_seed_str",
    value: function mint_key_str_to_pool_seed_str(mint_key_str) {
      return consts.pool_id_to_seed_str(mint_key_str_to_pool_id[mint_key_str]);
    }
  }, {
    key: "get_serum_market_and_vault_pda",
    value: function () {
      var _get_serum_market_and_vault_pda = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var marketAccount, nonceArray, vaultPda;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!true) {
                  _context.next = 15;
                  break;
                }

                _context.prev = 1;
                // keep trying until the default nonce array creates a pda that falls off the elliptic curve
                marketAccount = new S.Account();
                nonceArray = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
                _context.next = 6;
                return S.PublicKey.createProgramAddress([marketAccount.publicKey.toBuffer(), nonceArray], serumPubkey);

              case 6:
                vaultPda = _context.sent;
                return _context.abrupt("return", [marketAccount, vaultPda]);

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("continue", 0);

              case 13:
                _context.next = 0;
                break;

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 10]]);
      }));

      function get_serum_market_and_vault_pda() {
        return _get_serum_market_and_vault_pda.apply(this, arguments);
      }

      return get_serum_market_and_vault_pda;
    }()
  }]);

  return consts;
}();

exports.consts = consts;

_defineProperty(consts, "POOL_SUMMARIES_SEED", "PoolSummaries");

_defineProperty(consts, "CMD_REFRESH_USER", 0x0a);

_defineProperty(consts, "CMD_ADD_USER_AND_DEPOSIT", 0x10);

_defineProperty(consts, "CMD_DEPOSIT", 0x11);

_defineProperty(consts, "CMD_WITHDRAW", 0x12);

_defineProperty(consts, "CMD_BORROW", 0x13);

_defineProperty(consts, "CMD_REPAY", 0x14);

_defineProperty(consts, "CMD_EXTERN_LIQUIDATE", 0x15);

_defineProperty(consts, "CMD_SELF_LIQUIDATE", 0x16);

_defineProperty(consts, "CMD_UPDATE_USER_CONFIG", 0x17);

_defineProperty(consts, "CMD_MARGIN_SWAP", 0x18);

_defineProperty(consts, "CMD_UPDATE_USER_ASSET_CONFIG", 0x19);

_defineProperty(consts, "CMD_WITHDRAW_AND_REMOVE_USER", 0x1a);

_defineProperty(consts, "CMD_TOKEN_DEPOSIT", 0x1b);

_defineProperty(consts, "CMD_TOKEN_WITHDRAW", 0x1c);

_defineProperty(consts, "CMD_LP_CREATE", 0x1d);

_defineProperty(consts, "CMD_LP_REDEEM", 0x1e);

_defineProperty(consts, "AMOUNT_MULTIPLIER", 16777216);

_defineProperty(consts, "INVALID_PAGE", 65535);

_defineProperty(consts, "SWAP_FAKE", 0x00);

_defineProperty(consts, "SWAP_SERUM", 0x01);

_defineProperty(consts, "SWAP_RAYDIUM", 0x02);

_defineProperty(consts, "SWAP_SABER", 0x03);

_defineProperty(consts, "SWAP_MERCURIAL", 0x04);

_defineProperty(consts, "SWAP_ORCA", 0x05);

var Errors = /*#__PURE__*/function () {
  function Errors() {
    _classCallCheck(this, Errors);
  }

  _createClass(Errors, null, [{
    key: "exceptionToString",
    value: function exceptionToString(e) {
      var msg = e.message;

      if (msg.indexOf("custom program error") >= 0 && msg.indexOf("0x") >= 0) {
        var lastIdx = msg.lastIndexOf("0x");
        var errCode = msg.substr(lastIdx, 6);
        var code = parseInt(errCode);

        switch (code) {
          // error about accounts supplied
          case 0x1000:
            return "Internal error, incorrect base_pda account";

          case 0x1001:
            return "Internal error, incorrect user_pages_stats account";

          case 0x1002:
            return "Internal error, incorrect users_page account";

          case 0x1003:
            return "Internal error, incorrect user_info account";

          case 0x1004:
            return "Internal error, incorrect asset_pool account";

          case 0x1005:
            return "Internal error, incorrect asset_price account";

          case 0x1006:
            return "Internal error, incorrect asset_pool_spl account";

          case 0x1007:
            return "Internal error, incorrect user_asset_info account";

          case 0x1008:
            return "Internal error, missing active accounts";

          case 0x1009:
            return "Internal error, incorrect intermediate_spl account";

          case 0x100a:
            return "Internal error, incorrect collateral_market account";

          case 0x100b:
            return "Internal error, incorrect borrowed_market account";

          case 0x100c:
            return "Internal error, incorrect serum_program account";
          // error about instruction data

          case 0x2000:
            return "Internal error, missing page_id";

          case 0x2001:
            return "Internal error, page_id too large";

          case 0x2002:
            return "Internal error, missing amount";

          case 0x2003:
            return "Internal error, missing seed_str";

          case 0x2004:
            return "Internal error, missing acitve_seed_str";

          case 0x2005:
            return "Internal error, wrong instruction data size";
          // frontend error

          case 0x3000:
            return "Internal error, account already added. Should use deposit()";

          case 0x3001:
            return "Internal error, not enough available slots for chosen users_page";

          case 0x3002:
            return "Internal error, account not added. Should use add_user_and_deposit()";

          case 0x3002:
            return "Internal error, wallet did not sign";

          case 0x3002:
            return "Internal error, maximum number of pools reached";
          // user error

          case 0x4000:
            return "Trying to deposit an amount amount less than minimum required. Please try depositing more.";

          case 0x4001:
            return "User cannot withdraw more than their deposit.";

          case 0x4002:
            return "Pool does not have enough funds for borrowing/withdrawal at the time.";

          case 0x4003:
            return "Please try withdrawing all remaining amount as after the current withdrawal, amount of deposit left will be less than minimum required";

          case 0x4004:
            return "User does not have enough borrowing power. Please deposit more assets as collateral.";

          case 0x4005:
            return "User cannot repay more than what he owes.";

          case 0x4006:
            return "This withdrawal failed because it will cause user's collateral ratio to fall below requirement.";

          case 0x4007:
            return "This account cannot be liquidated as it has not reached liquidation threshold yet";

          case 0x4008:
            return "Liquidator asked for too much collateral";

          case 0x4009:
            return "Liquidator tried to repay more than what the user owes";

          case 0x400a:
            return "Liquidator asked for more collateral than the user has";

          case 0x400b:
            return "Liquidation will lead to a collateral ratio that is too large. Try liquidating less.";

          case 0x400c:
            return "Self-liquidation threshold is too small";
          // FIXME: how small is too small?

          case 0x400d:
            return "Post self-liquidation target ratio too small";
          // FIXME: how small is too small?

          case 0x400e:
            return "Post external-liquidation target ratio too small";
          // FIXME: how small is too small?

          case 0x400f:
            return "Self-liquidation threshold has not been reached yet";
          // FIXME: how small is too small?

          case 0x4010:
            return "Self-liquidation target exceeded";

          case 0x4011:
            return "Self-liquidation led to too much slippage";

          case 0x4012:
            return "Exceeded maximum number of assets supported";

          case 0x4013:
            return "Bought less than min";

          case 0x4014:
            return "Asset not used as collateral";
        }
      } else if (msg.indexOf("invalid account data") >= 0) {
        return "User does not appear to have created an SPL account for this token.";
      } else if (msg.indexOf("found no record of a prior credit") >= 0) {
        return "Cannot proceed as user has no SOL in their main wallet.";
      } else {
        // not custom error, not sure what to do with them yet
        return msg;
      }
    }
  }]);

  return Errors;
}();

exports.Errors = Errors;

var Parser = /*#__PURE__*/function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, null, [{
    key: "getOffsets",
    value: function getOffsets(widths) {
      var offsets = [];
      var ends = [];
      var offset = 0;

      for (var i in widths) {
        offsets.push(offset);
        offset += widths[i];
        ends.push(offset);
      }

      return [offsets, ends];
    }
  }, {
    key: "parseString",
    value: function parseString(buffer) {
      var decoded = new TextDecoder().decode(buffer);
      var len = decoded.indexOf("\0");
      return len == -1 ? decoded : decoded.substr(0, len);
    }
  }, {
    key: "parsePoolList",
    value: function parsePoolList(poolListData) {
      var count = new DataView(poolListData.buffer).getUint16(0, true);
      var result = new Array(count);

      for (var i = 0; i < count; i++) {
        var offset = 8 + i * 32;
        var end = offset + 32;
        result[i] = new S.PublicKey(new Uint8Array(poolListData.slice(offset, end)));
      }

      return result;
    }
  }, {
    key: "parseUint16",
    value: function parseUint16(buffer, offset) {
      var view = new DataView(buffer);
      return view.getUint16(offset, true);
    }
  }, {
    key: "parseUint32",
    value: function parseUint32(buffer, offset) {
      var view = new DataView(buffer);
      return view.getUint32(offset, true);
    }
  }, {
    key: "parseInt32",
    value: function parseInt32(buffer, offset) {
      var view = new DataView(buffer);
      return view.getInt32(offset, true);
    }
  }, {
    key: "parseBigUint64",
    value: function parseBigUint64(buffer, offset) {
      var view = new DataView(buffer);
      var lower = (0, _bigInteger["default"])(view.getUint32(offset, true));
      var higher = (0, _bigInteger["default"])(view.getUint32(offset + 4, true));
      return higher * (0, _bigInteger["default"])(4294967296) + lower;
    }
  }, {
    key: "parseFloat64",
    value: function parseFloat64(buffer, offset) {
      var view = new DataView(buffer);
      return view.getFloat64(offset, true);
    }
  }, {
    key: "setUint8",
    value: function setUint8(buffer, offset, value) {
      var view = new DataView(buffer);
      view.setUint8(offset, value);
    }
  }, {
    key: "setBigUint64",
    value: function setBigUint64(buffer, offset, value) {
      value = parseInt(value);
      var view = new DataView(buffer);
      var high = value / 4294967296;
      var low = value % 4294967296;
      view.setUint32(offset, low, true);
      view.setUint32(offset + 4, high, true);
    }
  }, {
    key: "setFloat64",
    value: function setFloat64(buffer, offset, value) {
      var view = new DataView(buffer);
      view.setFloat64(offset, value, true);
    }
  }, {
    key: "parseBigInt128",
    value: function parseBigInt128(buffer, offset) {
      var lower = Parser.parseBigUint64(buffer, offset);
      var higher = Parser.parseBigUint64(buffer, offset + 8);
      return higher * (0, _bigInteger["default"])(18446744073709551616) + lower;
    }
  }, {
    key: "parseAssetPool",
    value: function parseAssetPool(data) {
      var widths = [32, 32, 8, 1, 16, 8, 16, 8, 8, 16, 8, 8, 8, 32, 32, 32, 32, 8, 8, 8, 1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];

      var _Parser$getOffsets = Parser.getOffsets(widths),
          _Parser$getOffsets2 = _slicedToArray(_Parser$getOffsets, 2),
          offsets = _Parser$getOffsets2[0],
          ends = _Parser$getOffsets2[1];

      return {
        coin_name: Parser.parseString(data.slice(offsets[0], ends[0])),
        mint_key: new S.PublicKey(data.slice(offsets[1], ends[1])),
        mint_decimal_mult: Parser.parseBigUint64(data.buffer, offsets[2]),
        pool_id: data[offsets[3]],
        deposit_amount: Parser.parseBigInt128(data.buffer, offsets[4]) / (0, _bigInteger["default"])(consts.AMOUNT_MULTIPLIER),
        deposit_index: Parser.parseFloat64(data.buffer, offsets[5]),
        borrow_amount: Parser.parseBigInt128(data.buffer, offsets[6]) / (0, _bigInteger["default"])(consts.AMOUNT_MULTIPLIER),
        borrow_index: Parser.parseFloat64(data.buffer, offsets[7]),
        reserve_factor: Parser.parseFloat64(data.buffer, offsets[8]),
        fee_amount: Parser.parseBigInt128(data.buffer, offsets[9]) / (0, _bigInteger["default"])(consts.AMOUNT_MULTIPLIER),
        fee_withdrawn_amt: Parser.parseBigUint64(data.buffer, offsets[10]),
        fee_rate: Parser.parseFloat64(data.buffer, offsets[11]),
        last_update_time: Parser.parseBigUint64(data.buffer, offsets[12]),
        spl_key: new S.PublicKey(data.slice(offsets[13], ends[13])),
        atoken_mint_key: new S.PublicKey(data.slice(offsets[14], ends[14])),
        price_key: new S.PublicKey(data.slice(offsets[15], ends[15])),
        pyth_price_key: new S.PublicKey(data.slice(offsets[16], ends[16])),
        serum_next_cl_id: Parser.parseBigUint64(data.buffer, offsets[17]),
        ltv: Parser.parseFloat64(data.buffer, offsets[18]),
        safe_factor: Parser.parseFloat64(data.buffer, offsets[19]),
        flags: data[offsets[20]],
        base_rate: Parser.parseFloat64(data.buffer, offsets[21]),
        multiplier1: Parser.parseFloat64(data.buffer, offsets[22]),
        multiplier2: Parser.parseFloat64(data.buffer, offsets[23]),
        kink: Parser.parseFloat64(data.buffer, offsets[24]),
        borrow_rate: Parser.parseFloat64(data.buffer, offsets[25]),
        deposit_rate: Parser.parseFloat64(data.buffer, offsets[26]),
        reward_multiplier: Parser.parseFloat64(data.buffer, offsets[27]),
        reward_deposit_intra: Parser.parseFloat64(data.buffer, offsets[28]),
        reward_deposit_share: Parser.parseFloat64(data.buffer, offsets[29]),
        reward_borrow_share: Parser.parseFloat64(data.buffer, offsets[30]),
        reward_per_year: Parser.parseFloat64(data.buffer, offsets[31]),
        reward_per_year_deposit: Parser.parseFloat64(data.buffer, offsets[32]),
        reward_per_year_borrow: Parser.parseFloat64(data.buffer, offsets[33]),
        reward_per_year_per_d: Parser.parseFloat64(data.buffer, offsets[34]),
        reward_per_year_per_b: Parser.parseFloat64(data.buffer, offsets[35]),
        reward_deposit_index: Parser.parseFloat64(data.buffer, offsets[36]),
        reward_borrow_index: Parser.parseFloat64(data.buffer, offsets[37])
      };
    }
  }, {
    key: "parseAssetPrice",
    value: function parseAssetPrice(data) {
      return {
        price_in_usd: Parser.parseBigUint64(data.buffer, 0)
      };
    }
  }, {
    key: "parseUserPagesStats",
    value: function parseUserPagesStats(data) {
      var result = [];
      var view = new DataView(data.buffer);

      for (var offset = 0; offset < data.length; offset += 2) {
        result.push(view.getUint16(offset, true));
      }

      return result;
    }
  }, {
    key: "parseUsersPage",
    value: function parseUsersPage(data) {
      var result = [];
      var count = data.length / 32;

      for (var i = 0; i < count; i++) {
        var offset = i * 32;
        var end = offset + 32;
        result[i] = new S.PublicKey(new Uint8Array(data.slice(offset, end)));
      }

      return result;
    }
  }, {
    key: "parseUserInfo",
    value: function parseUserInfo(data) {
      var widths = [2, 1];

      var _Parser$getOffsets3 = Parser.getOffsets(widths),
          _Parser$getOffsets4 = _slicedToArray(_Parser$getOffsets3, 2),
          offsets = _Parser$getOffsets4[0],
          ends = _Parser$getOffsets4[1];

      var result = {
        page_id: new DataView(data.buffer.slice(offsets[0], ends[0])).getUint16(0, true),
        num_assets: data[offsets[1]],
        user_asset_info: []
      };
      var uai_base = ends[1];
      var uai_size = 1 + 1 + 16 + 8 + 8 + 8 + 8 + 16 + 8 + 8 + 8 + 8;

      for (var i = 0; i < result.num_assets; i++) {
        var uai_offset = uai_base + i * uai_size;
        result.user_asset_info.push(Parser.parseUserAssetInfo(data, uai_offset));
      }

      return result;
    }
  }, {
    key: "parseUserAssetInfo",
    value: function parseUserAssetInfo(data, offset) {
      var widths = [1, 1, 16, 8, 8, 8, 8, 16, 8, 8, 8, 8];

      var _Parser$getOffsets5 = Parser.getOffsets(widths),
          _Parser$getOffsets6 = _slicedToArray(_Parser$getOffsets5, 2),
          offsets = _Parser$getOffsets6[0],
          ends = _Parser$getOffsets6[1];

      return {
        pool_id: data[offset + offsets[0]],
        use_as_collateral: data[offset + offsets[1]],
        deposit_amount: Parser.parseBigInt128(data.buffer, offset + offsets[2]) / (0, _bigInteger["default"])(consts.AMOUNT_MULTIPLIER),
        deposit_interests: Parser.parseBigUint64(data.buffer, offset + offsets[3]),
        deposit_index: Parser.parseFloat64(data.buffer, offset + offsets[4]),
        reward_deposit_amount: Parser.parseFloat64(data.buffer, offset + offsets[5]),
        reward_deposit_index: Parser.parseFloat64(data.buffer, offset + offsets[6]),
        borrow_amount: Parser.parseBigInt128(data.buffer, offset + offsets[7]) / (0, _bigInteger["default"])(consts.AMOUNT_MULTIPLIER),
        borrow_interests: Parser.parseBigUint64(data.buffer, offset + offsets[8]),
        borrow_index: Parser.parseFloat64(data.buffer, offset + offsets[9]),
        reward_borrow_amount: Parser.parseFloat64(data.buffer, offset + offsets[10]),
        reward_borrow_index: Parser.parseFloat64(data.buffer, offset + offsets[11])
      };
    }
  }, {
    key: "getPoolIdArray",
    value: function getPoolIdArray(mint_key_str) {
      return [mint_key_str_to_pool_id[mint_key_str]];
    }
  }]);

  return Parser;
}();

exports.Parser = Parser;

var TxMaker = /*#__PURE__*/function () {
  function TxMaker() {
    _classCallCheck(this, TxMaker);
  }

  _createClass(TxMaker, null, [{
    key: "refresh_user",
    value: function () {
      var _refresh_user = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user_wallet_key) {
        var _yield$consts$get_bas, _yield$consts$get_bas2, base_pda, _1, userInfoKey, poolSummariesKey, inst;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas = _context2.sent;
                _yield$consts$get_bas2 = _slicedToArray(_yield$consts$get_bas, 2);
                base_pda = _yield$consts$get_bas2[0];
                _1 = _yield$consts$get_bas2[1];
                _context2.next = 8;
                return consts.get_user_info_key(user_wallet_key);

              case 8:
                userInfoKey = _context2.sent;
                _context2.next = 11;
                return consts.get_pool_summaries_key(base_pda);

              case 11:
                poolSummariesKey = _context2.sent;
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: [{
                    pubkey: user_wallet_key,
                    isSigner: false,
                    isWritable: false
                  }, // wallet
                  {
                    pubkey: userInfoKey,
                    isSigner: false,
                    isWritable: true
                  }, // UserInfo
                  {
                    pubkey: poolSummariesKey,
                    isSigner: false,
                    isWritable: false
                  } // PoolSummaries
                  ],
                  data: [consts.CMD_REFRESH_USER]
                });
                return _context2.abrupt("return", new S.Transaction().add(inst));

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function refresh_user(_x) {
        return _refresh_user.apply(this, arguments);
      }

      return refresh_user;
    }()
  }, {
    key: "update_user_config",
    value: function () {
      var _update_user_config = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user_wallet_account, self_liquidation_threshold, post_self_liquidation_ratio_target, post_extern_liquidation_ratio_target) {
        var wallet_key, userInfoKey, inst;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                wallet_key = user_wallet_account.publicKey;
                _context3.next = 3;
                return consts.get_user_info_key(wallet_key);

              case 3:
                userInfoKey = _context3.sent;
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: [{
                    pubkey: wallet_key,
                    isSigner: true,
                    isWritable: false
                  }, {
                    pubkey: userInfoKey,
                    isSigner: false,
                    isWritable: true
                  }],
                  data: [consts.CMD_UPDATE_USER_CONFIG, self_liquidation_threshold, post_self_liquidation_ratio_target, post_extern_liquidation_ratio_target]
                }); // signer: user_wallet

                return _context3.abrupt("return", new S.Transaction().add(inst));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function update_user_config(_x2, _x3, _x4, _x5) {
        return _update_user_config.apply(this, arguments);
      }

      return update_user_config;
    }()
  }, {
    key: "add_user_and_deposit",
    value: function () {
      var _add_user_and_deposit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(page_id, wallet_account, user_spl_key, mint_key_str, amount) {
        var _yield$consts$get_bas3, _yield$consts$get_bas4, base_pda, _0, user_wallet_key, userPagesStatsKey, usersPageKey, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, priceSummariesKey, buffer, view, payload, poolIdArray, inst;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas3 = _context4.sent;
                _yield$consts$get_bas4 = _slicedToArray(_yield$consts$get_bas3, 2);
                base_pda = _yield$consts$get_bas4[0];
                _0 = _yield$consts$get_bas4[1];
                user_wallet_key = wallet_account.publicKey;
                _context4.next = 9;
                return consts.get_user_pages_stats_key(base_pda);

              case 9:
                userPagesStatsKey = _context4.sent;
                _context4.next = 12;
                return consts.get_users_page_key(base_pda, page_id);

              case 12:
                usersPageKey = _context4.sent;
                _context4.next = 15;
                return consts.get_user_info_key(user_wallet_key);

              case 15:
                userInfoKey = _context4.sent;
                _context4.next = 18;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 18:
                assetPoolKey = _context4.sent;
                _context4.next = 21;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 21:
                assetPoolSplKey = _context4.sent;
                _context4.next = 24;
                return consts.get_pool_summaries_key(base_pda);

              case 24:
                poolSummariesKey = _context4.sent;
                _context4.next = 27;
                return consts.get_price_summaries_key(base_pda);

              case 27:
                priceSummariesKey = _context4.sent;
                buffer = new ArrayBuffer(10);
                view = new DataView(buffer);
                view.setUint16(0, page_id, true);
                Parser.setBigUint64(buffer, 2, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: [{
                    pubkey: user_wallet_key,
                    isSigner: true,
                    isWritable: true
                  }, // user wallet
                  {
                    pubkey: user_spl_key,
                    isSigner: false,
                    isWritable: true
                  }, // account for PoolList
                  {
                    pubkey: userPagesStatsKey,
                    isSigner: false,
                    isWritable: true
                  }, // UserPagesStats
                  {
                    pubkey: usersPageKey,
                    isSigner: false,
                    isWritable: true
                  }, // UsersPage
                  {
                    pubkey: userInfoKey,
                    isSigner: false,
                    isWritable: true
                  }, // UserInfo
                  {
                    pubkey: assetPoolKey,
                    isSigner: false,
                    isWritable: true
                  }, // AssetPool
                  {
                    pubkey: assetPoolSplKey,
                    isSigner: false,
                    isWritable: true
                  }, // AssetPool's spl account
                  {
                    pubkey: poolSummariesKey,
                    isSigner: false,
                    isWritable: true
                  }, // PoolSummaries
                  {
                    pubkey: priceSummariesKey,
                    isSigner: false,
                    isWritable: false
                  }, // PriceSummaries
                  {
                    pubkey: S.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                  }, // system program account
                  {
                    pubkey: T.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false
                  } // spl-token program account
                  ],
                  data: [consts.CMD_ADD_USER_AND_DEPOSIT].concat(payload).concat(poolIdArray)
                }); // signer: wallet_account

                return _context4.abrupt("return", new S.Transaction().add(inst));

              case 36:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function add_user_and_deposit(_x6, _x7, _x8, _x9, _x10) {
        return _add_user_and_deposit.apply(this, arguments);
      }

      return add_user_and_deposit;
    }()
  }, {
    key: "deposit",
    value: function () {
      var _deposit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(wallet_account, user_spl_key, mint_key_str, amount) {
        var _yield$consts$get_bas5, _yield$consts$get_bas6, base_pda, _0, user_wallet_key, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, buffer, payload, poolIdArray, inst;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas5 = _context5.sent;
                _yield$consts$get_bas6 = _slicedToArray(_yield$consts$get_bas5, 2);
                base_pda = _yield$consts$get_bas6[0];
                _0 = _yield$consts$get_bas6[1];
                user_wallet_key = wallet_account.publicKey;
                _context5.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context5.sent;
                _context5.next = 12;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 12:
                assetPoolKey = _context5.sent;
                _context5.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 15:
                assetPoolSplKey = _context5.sent;
                _context5.next = 18;
                return consts.get_pool_summaries_key(base_pda);

              case 18:
                poolSummariesKey = _context5.sent;
                buffer = new ArrayBuffer(8);
                Parser.setBigUint64(buffer, 0, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: [{
                    pubkey: user_wallet_key,
                    isSigner: true,
                    isWritable: true
                  }, // user wallet
                  {
                    pubkey: user_spl_key,
                    isSigner: false,
                    isWritable: true
                  }, // account for PoolList
                  {
                    pubkey: userInfoKey,
                    isSigner: false,
                    isWritable: true
                  }, // UserInfo
                  {
                    pubkey: assetPoolKey,
                    isSigner: false,
                    isWritable: true
                  }, // AssetPool
                  {
                    pubkey: assetPoolSplKey,
                    isSigner: false,
                    isWritable: true
                  }, // AssetPool's spl account
                  {
                    pubkey: poolSummariesKey,
                    isSigner: false,
                    isWritable: true
                  }, // PoolSummaries
                  {
                    pubkey: T.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false
                  } // spl-token program account
                  ],
                  data: [consts.CMD_DEPOSIT].concat(payload).concat(poolIdArray)
                }); // signer: wallet_account

                return _context5.abrupt("return", new S.Transaction().add(inst));

              case 25:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function deposit(_x11, _x12, _x13, _x14) {
        return _deposit.apply(this, arguments);
      }

      return deposit;
    }()
  }, {
    key: "withdraw_and_remove_user",
    value: function () {
      var _withdraw_and_remove_user = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount, user_info) {
        var page_id, _yield$consts$get_bas7, _yield$consts$get_bas8, base_pda, _0, user_wallet_key, userPagesStatsKey, usersPageKey, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, priceSummariesKey, keys, buffer, payload, poolIdArray, data, inst;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                page_id = user_info.page_id;

                if (!(page_id > 10000)) {
                  _context6.next = 4;
                  break;
                }

                console.log("User not added to backend yet.");
                return _context6.abrupt("return");

              case 4:
                _context6.next = 6;
                return consts.get_base_pda();

              case 6:
                _yield$consts$get_bas7 = _context6.sent;
                _yield$consts$get_bas8 = _slicedToArray(_yield$consts$get_bas7, 2);
                base_pda = _yield$consts$get_bas8[0];
                _0 = _yield$consts$get_bas8[1];
                user_wallet_key = wallet_account.publicKey;
                _context6.next = 13;
                return consts.get_user_pages_stats_key(base_pda);

              case 13:
                userPagesStatsKey = _context6.sent;
                _context6.next = 16;
                return consts.get_users_page_key(base_pda, page_id);

              case 16:
                usersPageKey = _context6.sent;
                _context6.next = 19;
                return consts.get_user_info_key(user_wallet_key);

              case 19:
                userInfoKey = _context6.sent;
                _context6.next = 22;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 22:
                assetPoolKey = _context6.sent;
                _context6.next = 25;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 25:
                assetPoolSplKey = _context6.sent;
                _context6.next = 28;
                return consts.get_pool_summaries_key(base_pda);

              case 28:
                poolSummariesKey = _context6.sent;
                _context6.next = 31;
                return consts.get_price_summaries_key(base_pda);

              case 31:
                priceSummariesKey = _context6.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: true
                }, // user wallet
                {
                  pubkey: user_spl_key,
                  isSigner: false,
                  isWritable: true
                }, // account for PoolList
                {
                  pubkey: userPagesStatsKey,
                  isSigner: false,
                  isWritable: true
                }, // UserPagesStats
                {
                  pubkey: usersPageKey,
                  isSigner: false,
                  isWritable: true
                }, // UsersPage
                {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, // UserInfo
                {
                  pubkey: assetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool
                {
                  pubkey: assetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool's spl account
                {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, // PriceSummaries
                {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, // base_pda
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ];
                buffer = new ArrayBuffer(9);
                Parser.setUint8(buffer, 0, withdraw_all ? 1 : 0);
                Parser.setBigUint64(buffer, 1, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                data = [consts.CMD_WITHDRAW_AND_REMOVE_USER].concat(payload).concat(poolIdArray);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                }); // signer: wallet_account

                return _context6.abrupt("return", new S.Transaction().add(inst));

              case 41:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function withdraw_and_remove_user(_x15, _x16, _x17, _x18, _x19, _x20) {
        return _withdraw_and_remove_user.apply(this, arguments);
      }

      return withdraw_and_remove_user;
    }()
  }, {
    key: "withdraw",
    value: function () {
      var _withdraw = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        var _yield$consts$get_bas9, _yield$consts$get_bas10, base_pda, _0, user_wallet_key, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, priceSummariesKey, keys, buffer, payload, poolIdArray, data, inst;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas9 = _context7.sent;
                _yield$consts$get_bas10 = _slicedToArray(_yield$consts$get_bas9, 2);
                base_pda = _yield$consts$get_bas10[0];
                _0 = _yield$consts$get_bas10[1];
                user_wallet_key = wallet_account.publicKey;
                _context7.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context7.sent;
                _context7.next = 12;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 12:
                assetPoolKey = _context7.sent;
                _context7.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 15:
                assetPoolSplKey = _context7.sent;
                _context7.next = 18;
                return consts.get_pool_summaries_key(base_pda);

              case 18:
                poolSummariesKey = _context7.sent;
                _context7.next = 21;
                return consts.get_price_summaries_key(base_pda);

              case 21:
                priceSummariesKey = _context7.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: true
                }, // user wallet
                {
                  pubkey: user_spl_key,
                  isSigner: false,
                  isWritable: true
                }, // account for PoolList
                {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, // UserInfo
                {
                  pubkey: assetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool
                {
                  pubkey: assetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool's spl account
                {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, // PriceSummaries
                {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, // base_pda
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ];
                buffer = new ArrayBuffer(9);
                Parser.setUint8(buffer, 0, withdraw_all ? 1 : 0);
                Parser.setBigUint64(buffer, 1, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                data = [consts.CMD_WITHDRAW].concat(payload).concat(poolIdArray);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                }); // signer: wallet_account

                return _context7.abrupt("return", new S.Transaction().add(inst));

              case 31:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function withdraw(_x21, _x22, _x23, _x24, _x25) {
        return _withdraw.apply(this, arguments);
      }

      return withdraw;
    }()
  }, {
    key: "borrow",
    value: function () {
      var _borrow = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(wallet_account, user_spl_key, mint_key_str, amount) {
        var _yield$consts$get_bas11, _yield$consts$get_bas12, base_pda, _0, user_wallet_key, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, priceSummariesKey, keys, buffer, payload, poolIdArray, data, inst;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas11 = _context8.sent;
                _yield$consts$get_bas12 = _slicedToArray(_yield$consts$get_bas11, 2);
                base_pda = _yield$consts$get_bas12[0];
                _0 = _yield$consts$get_bas12[1];
                user_wallet_key = wallet_account.publicKey;
                _context8.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context8.sent;
                _context8.next = 12;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 12:
                assetPoolKey = _context8.sent;
                _context8.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 15:
                assetPoolSplKey = _context8.sent;
                _context8.next = 18;
                return consts.get_pool_summaries_key(base_pda);

              case 18:
                poolSummariesKey = _context8.sent;
                _context8.next = 21;
                return consts.get_price_summaries_key(base_pda);

              case 21:
                priceSummariesKey = _context8.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: true
                }, // user wallet
                {
                  pubkey: user_spl_key,
                  isSigner: false,
                  isWritable: true
                }, // account for PoolList
                {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, // UserInfo
                {
                  pubkey: assetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool
                {
                  pubkey: assetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool's spl account
                {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, // PriceSummaries
                {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, // base_pda
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ];
                buffer = new ArrayBuffer(8);
                Parser.setBigUint64(buffer, 0, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                data = [consts.CMD_BORROW].concat(payload).concat(poolIdArray);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                }); // signer: wallet_account

                return _context8.abrupt("return", new S.Transaction().add(inst));

              case 30:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function borrow(_x26, _x27, _x28, _x29) {
        return _borrow.apply(this, arguments);
      }

      return borrow;
    }()
  }, {
    key: "repay",
    value: function () {
      var _repay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(wallet_account, user_spl_key, mint_key_str, repay_all, amount) {
        var _yield$consts$get_bas13, _yield$consts$get_bas14, base_pda, _0, user_wallet_key, userInfoKey, assetPoolKey, assetPoolSplKey, poolSummariesKey, keys, buffer, payload, poolIdArray, inst;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas13 = _context9.sent;
                _yield$consts$get_bas14 = _slicedToArray(_yield$consts$get_bas13, 2);
                base_pda = _yield$consts$get_bas14[0];
                _0 = _yield$consts$get_bas14[1];
                user_wallet_key = wallet_account.publicKey;
                _context9.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context9.sent;
                _context9.next = 12;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 12:
                assetPoolKey = _context9.sent;
                _context9.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, mint_key_str);

              case 15:
                assetPoolSplKey = _context9.sent;
                _context9.next = 18;
                return consts.get_pool_summaries_key(base_pda);

              case 18:
                poolSummariesKey = _context9.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: true
                }, // user wallet
                {
                  pubkey: user_spl_key,
                  isSigner: false,
                  isWritable: true
                }, // account for PoolList
                {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, // UserInfo
                {
                  pubkey: assetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool
                {
                  pubkey: assetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, // AssetPool's spl account
                {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ];
                buffer = new ArrayBuffer(9);
                Parser.setUint8(buffer, 0, repay_all ? 1 : 0);
                Parser.setBigUint64(buffer, 1, amount);
                payload = Array.from(new Uint8Array(buffer));
                poolIdArray = Parser.getPoolIdArray(mint_key_str);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: [consts.CMD_REPAY].concat(payload).concat(poolIdArray)
                }); // signer: wallet_account

                return _context9.abrupt("return", new S.Transaction().add(inst));

              case 27:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function repay(_x30, _x31, _x32, _x33, _x34) {
        return _repay.apply(this, arguments);
      }

      return repay;
    }()
  }, {
    key: "extern_liquidate",
    value: function () {
      var _extern_liquidate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(liquidator_wallet_account, liquidated_wallet_key, liquidator_collateral_spl, // PublicKey
      liquidator_borrowed_spl, // PublicKey
      collateral_mint_str, borrowed_mint_str, min_collateral_amount, repaid_borrow_amount) {
        var _yield$consts$get_bas15, _yield$consts$get_bas16, base_pda, _0, liquidator_wallet_key, userInfoKey, collateralPoolKey, collateralPoolSpl, borrowedPoolKey, borrowedPoolSpl, poolSummariesKey, priceSummariesKey, keys, buffer, payload, collateralPoolIdArray, borrowedPoolIdArray, data, inst;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas15 = _context10.sent;
                _yield$consts$get_bas16 = _slicedToArray(_yield$consts$get_bas15, 2);
                base_pda = _yield$consts$get_bas16[0];
                _0 = _yield$consts$get_bas16[1];
                liquidator_wallet_key = liquidator_wallet_account.publicKey;
                _context10.next = 9;
                return consts.get_user_info_key(liquidated_wallet_key);

              case 9:
                userInfoKey = _context10.sent;
                _context10.next = 12;
                return consts.get_asset_pool_key(base_pda, collateral_mint_str);

              case 12:
                collateralPoolKey = _context10.sent;
                _context10.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, collateral_mint_str);

              case 15:
                collateralPoolSpl = _context10.sent;
                _context10.next = 18;
                return consts.get_asset_pool_key(base_pda, borrowed_mint_str);

              case 18:
                borrowedPoolKey = _context10.sent;
                _context10.next = 21;
                return consts.get_asset_pool_spl_key(base_pda, borrowed_mint_str);

              case 21:
                borrowedPoolSpl = _context10.sent;
                _context10.next = 24;
                return consts.get_pool_summaries_key(base_pda);

              case 24:
                poolSummariesKey = _context10.sent;
                _context10.next = 27;
                return consts.get_price_summaries_key(base_pda);

              case 27:
                priceSummariesKey = _context10.sent;
                keys = [{
                  pubkey: liquidated_wallet_key,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: liquidator_wallet_key,
                  isSigner: true,
                  isWritable: false
                }, {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: liquidator_collateral_spl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: liquidator_borrowed_spl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: collateralPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: collateralPoolSpl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: borrowedPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: borrowedPoolSpl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, // PriceSummaries
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ];
                buffer = new ArrayBuffer(8 + 8);
                Parser.setBigUint64(buffer, 0, min_collateral_amount);
                Parser.setBigUint64(buffer, 8, repaid_borrow_amount);
                payload = Array.from(new Uint8Array(buffer));
                collateralPoolIdArray = Parser.getPoolIdArray(collateral_mint_str);
                borrowedPoolIdArray = Parser.getPoolIdArray(borrowed_mint_str);
                data = [consts.CMD_EXTERN_LIQUIDATE].concat(payload).concat(collateralPoolIdArray).concat(borrowedPoolIdArray);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                }); // signer: liquidator_wallet_account

                return _context10.abrupt("return", new S.Transaction().add(inst));

              case 38:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function extern_liquidate(_x35, _x36, _x37, _x38, _x39, _x40, _x41, _x42) {
        return _extern_liquidate.apply(this, arguments);
      }

      return extern_liquidate;
    }()
  }, {
    key: "build_margin_swap_param",
    value: function build_margin_swap_param(target_swap, is_buy, sell_mint_str, sell_amount, buy_mint_str, buy_amount) {
      var buffer = new ArrayBuffer(1 + 8 + 8);
      Parser.setUint8(buffer, 0, is_buy ? 1 : 0);
      Parser.setBigUint64(buffer, 1, sell_amount);
      Parser.setBigUint64(buffer, 9, buy_amount);
      var payload = Array.from(new Uint8Array(buffer));
      var sellPoolIdArray = Parser.getPoolIdArray(sell_mint_str);
      var buyPoolIdArray = Parser.getPoolIdArray(buy_mint_str);
      return [consts.CMD_MARGIN_SWAP].concat(payload).concat(sellPoolIdArray).concat(buyPoolIdArray).concat([target_swap]);
    }
  }, {
    key: "margin_swap",
    value: function () {
      var _margin_swap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(user_wallet_key, target_swap, is_buy, sell_mint_str, sell_amount, buy_mint_str, buy_amount, serum_keys, is_signed) {
        var _yield$consts$get_bas17, _yield$consts$get_bas18, base_pda, _0, userInfoKey, collateralPoolKey, collateralPoolSpl, borrowedPoolKey, borrowedPoolSpl, poolSummariesKey, priceSummariesKey, keys, data, inst;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas17 = _context11.sent;
                _yield$consts$get_bas18 = _slicedToArray(_yield$consts$get_bas17, 2);
                base_pda = _yield$consts$get_bas18[0];
                _0 = _yield$consts$get_bas18[1];
                _context11.next = 8;
                return consts.get_user_info_key(user_wallet_key);

              case 8:
                userInfoKey = _context11.sent;
                _context11.next = 11;
                return consts.get_asset_pool_key(base_pda, sell_mint_str);

              case 11:
                collateralPoolKey = _context11.sent;
                _context11.next = 14;
                return consts.get_asset_pool_spl_key(base_pda, sell_mint_str);

              case 14:
                collateralPoolSpl = _context11.sent;
                _context11.next = 17;
                return consts.get_asset_pool_key(base_pda, buy_mint_str);

              case 17:
                borrowedPoolKey = _context11.sent;
                _context11.next = 20;
                return consts.get_asset_pool_spl_key(base_pda, buy_mint_str);

              case 20:
                borrowedPoolSpl = _context11.sent;
                _context11.next = 23;
                return consts.get_pool_summaries_key(base_pda);

              case 23:
                poolSummariesKey = _context11.sent;
                _context11.next = 26;
                return consts.get_price_summaries_key(base_pda);

              case 26:
                priceSummariesKey = _context11.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: is_signed,
                  isWritable: false
                }, {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: collateralPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: collateralPoolSpl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: borrowedPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: borrowedPoolSpl,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, // PoolSummaries
                {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, // PriceSummaries
                {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                } // spl-token program account
                ].concat(serum_keys);
                data = TxMaker.build_margin_swap_param(target_swap, is_buy, sell_mint_str, sell_amount, buy_mint_str, buy_amount);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                }); // signer: devAccount

                return _context11.abrupt("return", new S.Transaction().add(inst));

              case 31:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function margin_swap(_x43, _x44, _x45, _x46, _x47, _x48, _x49, _x50, _x51) {
        return _margin_swap.apply(this, arguments);
      }

      return margin_swap;
    }()
  }, {
    key: "margin_lp_create",
    value: function () {
      var _margin_lp_create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(wallet_account, left_mint_str, left_amount, right_mint_str, right_amount, lp_mint_str, min_lp_amount, target_swap, swap_account_keys) {
        var _yield$consts$get_bas19, _yield$consts$get_bas20, base_pda, _0, user_wallet_key, userInfoKey, leftAssetPoolKey, leftAssetPoolSplKey, rightAssetPoolKey, rightAssetPoolSplKey, lpAssetPoolKey, lpAssetPoolSplKey, poolSummariesKey, priceSummariesKey, keys, buffer, leftPoolId, rightPoolId, lpPoolId, payload, data, inst;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas19 = _context12.sent;
                _yield$consts$get_bas20 = _slicedToArray(_yield$consts$get_bas19, 2);
                base_pda = _yield$consts$get_bas20[0];
                _0 = _yield$consts$get_bas20[1];
                user_wallet_key = wallet_account.publicKey;
                _context12.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context12.sent;
                _context12.next = 12;
                return consts.get_asset_pool_key(base_pda, left_mint_str);

              case 12:
                leftAssetPoolKey = _context12.sent;
                _context12.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, left_mint_str);

              case 15:
                leftAssetPoolSplKey = _context12.sent;
                _context12.next = 18;
                return consts.get_asset_pool_key(base_pda, right_mint_str);

              case 18:
                rightAssetPoolKey = _context12.sent;
                _context12.next = 21;
                return consts.get_asset_pool_spl_key(base_pda, right_mint_str);

              case 21:
                rightAssetPoolSplKey = _context12.sent;
                _context12.next = 24;
                return consts.get_asset_pool_key(base_pda, lp_mint_str);

              case 24:
                lpAssetPoolKey = _context12.sent;
                _context12.next = 27;
                return consts.get_asset_pool_spl_key(base_pda, lp_mint_str);

              case 27:
                lpAssetPoolSplKey = _context12.sent;
                _context12.next = 30;
                return consts.get_pool_summaries_key(base_pda);

              case 30:
                poolSummariesKey = _context12.sent;
                _context12.next = 33;
                return consts.get_price_summaries_key(base_pda);

              case 33:
                priceSummariesKey = _context12.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: false
                }, {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: leftAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: leftAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: rightAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: rightAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: lpAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: lpAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                }].concat(swap_account_keys);
                buffer = new ArrayBuffer(28);
                Parser.setBigUint64(buffer, 0, left_amount);
                Parser.setBigUint64(buffer, 8, right_amount);
                Parser.setBigUint64(buffer, 16, min_lp_amount);
                leftPoolId = Parser.getPoolIdArray(left_mint_str);
                Parser.setUint8(buffer, 24, leftPoolId);
                rightPoolId = Parser.getPoolIdArray(right_mint_str);
                Parser.setUint8(buffer, 25, rightPoolId);
                lpPoolId = Parser.getPoolIdArray(lp_mint_str);
                Parser.setUint8(buffer, 26, lpPoolId);
                Parser.setUint8(buffer, 27, target_swap);
                payload = Array.from(new Uint8Array(buffer));
                data = [consts.CMD_LP_CREATE].concat(payload);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                });
                return _context12.abrupt("return", new S.Transaction().add(inst));

              case 50:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function margin_lp_create(_x52, _x53, _x54, _x55, _x56, _x57, _x58, _x59, _x60) {
        return _margin_lp_create.apply(this, arguments);
      }

      return margin_lp_create;
    }()
  }, {
    key: "margin_lp_redeem",
    value: function () {
      var _margin_lp_redeem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(wallet_account, left_mint_str, min_left_amount, right_mint_str, min_right_amount, lp_mint_str, lp_amount, target_swap, swap_account_keys) {
        var _yield$consts$get_bas21, _yield$consts$get_bas22, base_pda, _0, user_wallet_key, userInfoKey, leftAssetPoolKey, leftAssetPoolSplKey, rightAssetPoolKey, rightAssetPoolSplKey, lpAssetPoolKey, lpAssetPoolSplKey, poolSummariesKey, priceSummariesKey, keys, buffer, leftPoolId, rightPoolId, lpPoolId, payload, data, inst;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas21 = _context13.sent;
                _yield$consts$get_bas22 = _slicedToArray(_yield$consts$get_bas21, 2);
                base_pda = _yield$consts$get_bas22[0];
                _0 = _yield$consts$get_bas22[1];
                user_wallet_key = wallet_account.publicKey;
                _context13.next = 9;
                return consts.get_user_info_key(user_wallet_key);

              case 9:
                userInfoKey = _context13.sent;
                _context13.next = 12;
                return consts.get_asset_pool_key(base_pda, left_mint_str);

              case 12:
                leftAssetPoolKey = _context13.sent;
                _context13.next = 15;
                return consts.get_asset_pool_spl_key(base_pda, left_mint_str);

              case 15:
                leftAssetPoolSplKey = _context13.sent;
                _context13.next = 18;
                return consts.get_asset_pool_key(base_pda, right_mint_str);

              case 18:
                rightAssetPoolKey = _context13.sent;
                _context13.next = 21;
                return consts.get_asset_pool_spl_key(base_pda, right_mint_str);

              case 21:
                rightAssetPoolSplKey = _context13.sent;
                _context13.next = 24;
                return consts.get_asset_pool_key(base_pda, lp_mint_str);

              case 24:
                lpAssetPoolKey = _context13.sent;
                _context13.next = 27;
                return consts.get_asset_pool_spl_key(base_pda, lp_mint_str);

              case 27:
                lpAssetPoolSplKey = _context13.sent;
                _context13.next = 30;
                return consts.get_pool_summaries_key(base_pda);

              case 30:
                poolSummariesKey = _context13.sent;
                _context13.next = 33;
                return consts.get_price_summaries_key(base_pda);

              case 33:
                priceSummariesKey = _context13.sent;
                keys = [{
                  pubkey: user_wallet_key,
                  isSigner: true,
                  isWritable: true
                }, {
                  pubkey: userInfoKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: base_pda,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: leftAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: leftAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: rightAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: rightAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: lpAssetPoolKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: lpAssetPoolSplKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: poolSummariesKey,
                  isSigner: false,
                  isWritable: true
                }, {
                  pubkey: priceSummariesKey,
                  isSigner: false,
                  isWritable: false
                }, {
                  pubkey: T.TOKEN_PROGRAM_ID,
                  isSigner: false,
                  isWritable: false
                }].concat(swap_account_keys);
                buffer = new ArrayBuffer(28);
                Parser.setBigUint64(buffer, 0, min_left_amount);
                Parser.setBigUint64(buffer, 8, min_right_amount);
                Parser.setBigUint64(buffer, 16, lp_amount);
                leftPoolId = Parser.getPoolIdArray(left_mint_str);
                Parser.setUint8(buffer, 24, leftPoolId);
                rightPoolId = Parser.getPoolIdArray(right_mint_str);
                Parser.setUint8(buffer, 25, rightPoolId);
                lpPoolId = Parser.getPoolIdArray(lp_mint_str);
                Parser.setUint8(buffer, 26, lpPoolId);
                Parser.setUint8(buffer, 27, target_swap);
                payload = Array.from(new Uint8Array(buffer));
                data = [consts.CMD_LP_REDEEM].concat(payload);
                inst = new S.TransactionInstruction({
                  programId: programPubkey,
                  keys: keys,
                  data: data
                });
                return _context13.abrupt("return", new S.Transaction().add(inst));

              case 50:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function margin_lp_redeem(_x61, _x62, _x63, _x64, _x65, _x66, _x67, _x68, _x69) {
        return _margin_lp_redeem.apply(this, arguments);
      }

      return margin_lp_redeem;
    }()
  }]);

  return TxMaker;
}();

exports.TxMaker = TxMaker;

var ConnWrapper = /*#__PURE__*/function () {
  function ConnWrapper(connection) {
    _classCallCheck(this, ConnWrapper);

    this.connection = connection;
  }

  _createClass(ConnWrapper, [{
    key: "refresh_user",
    value: function () {
      var _refresh_user2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(payer_account, user_wallet_key) {
        var tx;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return TxMaker.refresh_user(user_wallet_key);

              case 2:
                tx = _context14.sent;
                return _context14.abrupt("return", this.connection.sendTransaction(tx, [payer_account]));

              case 4:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function refresh_user(_x70, _x71) {
        return _refresh_user2.apply(this, arguments);
      }

      return refresh_user;
    }()
  }, {
    key: "update_user_config",
    value: function () {
      var _update_user_config2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(user_wallet_account, self_liquidation_threshold, post_self_liquidation_ratio_target, post_extern_liquidation_ratio_target) {
        var tx;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return TxMaker.update_user_config(user_wallet_account, self_liquidation_threshold, post_self_liquidation_ratio_target, post_extern_liquidation_ratio_target);

              case 2:
                tx = _context15.sent;
                return _context15.abrupt("return", this.connection.sendTransaction(tx, [user_wallet_account]));

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function update_user_config(_x72, _x73, _x74, _x75) {
        return _update_user_config2.apply(this, arguments);
      }

      return update_user_config;
    }()
  }, {
    key: "add_user_and_deposit",
    value: function () {
      var _add_user_and_deposit2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(wallet_account, user_spl_key, mint_key_str, amount) {
        var num_free_slots, max_num_free, max_page_id, tx;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.getParsedUserPagesStats();

              case 2:
                num_free_slots = _context16.sent;
                max_num_free = Math.max.apply(Math, _toConsumableArray(num_free_slots));
                max_page_id = num_free_slots.indexOf(max_num_free);
                _context16.next = 7;
                return TxMaker.add_user_and_deposit(max_page_id, wallet_account, user_spl_key, mint_key_str, amount);

              case 7:
                tx = _context16.sent;
                return _context16.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 9:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function add_user_and_deposit(_x76, _x77, _x78, _x79) {
        return _add_user_and_deposit2.apply(this, arguments);
      }

      return add_user_and_deposit;
    }()
  }, {
    key: "deposit",
    value: function () {
      var _deposit2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(wallet_account, user_spl_key, mint_key_str, amount) {
        var tx;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return TxMaker.deposit(wallet_account, user_spl_key, mint_key_str, amount);

              case 2:
                tx = _context17.sent;
                return _context17.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function deposit(_x80, _x81, _x82, _x83) {
        return _deposit2.apply(this, arguments);
      }

      return deposit;
    }()
  }, {
    key: "withdraw_and_remove_user",
    value: function () {
      var _withdraw_and_remove_user2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        var user_info, tx;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return this.getParsedUserInfo(wallet_account.publicKey);

              case 2:
                user_info = _context18.sent;
                _context18.next = 5;
                return TxMaker.withdraw_and_remove_user(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount, user_info);

              case 5:
                tx = _context18.sent;
                return _context18.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 7:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function withdraw_and_remove_user(_x84, _x85, _x86, _x87, _x88) {
        return _withdraw_and_remove_user2.apply(this, arguments);
      }

      return withdraw_and_remove_user;
    }()
  }, {
    key: "withdraw",
    value: function () {
      var _withdraw2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        var tx;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return TxMaker.withdraw(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount);

              case 2:
                tx = _context19.sent;
                return _context19.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function withdraw(_x89, _x90, _x91, _x92, _x93) {
        return _withdraw2.apply(this, arguments);
      }

      return withdraw;
    }()
  }, {
    key: "borrow",
    value: function () {
      var _borrow2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(wallet_account, user_spl_key, mint_key_str, amount) {
        var tx;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return TxMaker.borrow(wallet_account, user_spl_key, mint_key_str, amount);

              case 2:
                tx = _context20.sent;
                return _context20.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function borrow(_x94, _x95, _x96, _x97) {
        return _borrow2.apply(this, arguments);
      }

      return borrow;
    }()
  }, {
    key: "repay",
    value: function () {
      var _repay2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(wallet_account, user_spl_key, mint_key_str, repay_all, amount) {
        var tx;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return TxMaker.repay(wallet_account, user_spl_key, mint_key_str, repay_all, amount);

              case 2:
                tx = _context21.sent;
                return _context21.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function repay(_x98, _x99, _x100, _x101, _x102) {
        return _repay2.apply(this, arguments);
      }

      return repay;
    }()
  }, {
    key: "extern_liquidate",
    value: function () {
      var _extern_liquidate2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(liquidator_wallet_account, liquidated_wallet_key, liquidator_collateral_spl, // PublicKey
      liquidator_borrowed_spl, // PublicKey
      collateral_mint_str, borrowed_mint_str, min_collateral_amount, repaid_borrow_amount) {
        var tx;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return TxMaker.extern_liquidate(liquidator_wallet_account, liquidated_wallet_key, liquidator_collateral_spl, // PublicKey
                liquidator_borrowed_spl, // PublicKey
                collateral_mint_str, borrowed_mint_str, min_collateral_amount, repaid_borrow_amount);

              case 2:
                tx = _context22.sent;
                return _context22.abrupt("return", this.connection.sendTransaction(tx, [liquidator_wallet_account]));

              case 4:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function extern_liquidate(_x103, _x104, _x105, _x106, _x107, _x108, _x109, _x110) {
        return _extern_liquidate2.apply(this, arguments);
      }

      return extern_liquidate;
    }()
  }, {
    key: "margin_swap",
    value: function () {
      var _margin_swap2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(user_wallet_account, target_swap, is_buy, collateral_mint_str, sell_collateral_amount, borrowed_mint_str, buy_borrowed_amount, serum_keys, is_signed) {
        var tx;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return TxMaker.margin_swap(user_wallet_account.publicKey, target_swap, is_buy, collateral_mint_str, sell_collateral_amount, borrowed_mint_str, buy_borrowed_amount, serum_keys, is_signed);

              case 2:
                tx = _context23.sent;
                return _context23.abrupt("return", this.connection.sendTransaction(tx, [user_wallet_account]));

              case 4:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function margin_swap(_x111, _x112, _x113, _x114, _x115, _x116, _x117, _x118, _x119) {
        return _margin_swap2.apply(this, arguments);
      }

      return margin_swap;
    }()
  }, {
    key: "margin_lp_create",
    value: function () {
      var _margin_lp_create2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(wallet_account, left_mint_str, left_amount, right_mint_str, right_amount, lp_mint_str, min_lp_amount, target_swap, swap_account_keys) {
        var tx;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return TxMaker.margin_lp_create(wallet_account, left_mint_str, left_amount, right_mint_str, right_amount, lp_mint_str, min_lp_amount, target_swap, swap_account_keys);

              case 2:
                tx = _context24.sent;
                return _context24.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function margin_lp_create(_x120, _x121, _x122, _x123, _x124, _x125, _x126, _x127, _x128) {
        return _margin_lp_create2.apply(this, arguments);
      }

      return margin_lp_create;
    }()
  }, {
    key: "margin_lp_redeem",
    value: function () {
      var _margin_lp_redeem2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(wallet_account, left_mint_str, min_left_amount, right_mint_str, min_right_amount, lp_mint_str, lp_amount, target_swap, swap_account_keys) {
        var tx;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return TxMaker.margin_lp_redeem(wallet_account.publicKey, left_mint_str, min_left_amount, right_mint_str, min_right_amount, lp_mint_str, lp_amount, target_swap, swap_account_keys);

              case 2:
                tx = _context25.sent;
                return _context25.abrupt("return", this.connection.sendTransaction(tx, [wallet_account]));

              case 4:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function margin_lp_redeem(_x129, _x130, _x131, _x132, _x133, _x134, _x135, _x136, _x137) {
        return _margin_lp_redeem2.apply(this, arguments);
      }

      return margin_lp_redeem;
    }()
  }, {
    key: "getParsedPoolList",
    value: function () {
      var _getParsedPoolList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
        var _yield$consts$get_bas23, _yield$consts$get_bas24, base_pda, bump, pool_list_pubkey, response;

        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas23 = _context26.sent;
                _yield$consts$get_bas24 = _slicedToArray(_yield$consts$get_bas23, 2);
                base_pda = _yield$consts$get_bas24[0];
                bump = _yield$consts$get_bas24[1];
                _context26.next = 8;
                return consts.get_pool_list_key(base_pda);

              case 8:
                pool_list_pubkey = _context26.sent;
                _context26.next = 11;
                return this.connection.getParsedAccountInfo(pool_list_pubkey);

              case 11:
                response = _context26.sent;
                return _context26.abrupt("return", Parser.parsePoolList(new Uint8Array(response.value.data)));

              case 13:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function getParsedPoolList() {
        return _getParsedPoolList.apply(this, arguments);
      }

      return getParsedPoolList;
    }()
  }, {
    key: "getParsedUserPagesStats",
    value: function () {
      var _getParsedUserPagesStats = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
        var _yield$consts$get_bas25, _yield$consts$get_bas26, base_pda, _, statsAccountKey, response;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas25 = _context27.sent;
                _yield$consts$get_bas26 = _slicedToArray(_yield$consts$get_bas25, 2);
                base_pda = _yield$consts$get_bas26[0];
                _ = _yield$consts$get_bas26[1];
                _context27.next = 8;
                return consts.get_user_pages_stats_key(base_pda);

              case 8:
                statsAccountKey = _context27.sent;
                _context27.next = 11;
                return this.connection.getParsedAccountInfo(statsAccountKey);

              case 11:
                response = _context27.sent;
                return _context27.abrupt("return", Parser.parseUserPagesStats(new Uint8Array(response.value.data)));

              case 13:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function getParsedUserPagesStats() {
        return _getParsedUserPagesStats.apply(this, arguments);
      }

      return getParsedUserPagesStats;
    }()
  }, {
    key: "getParsedAssetPool",
    value: function () {
      var _getParsedAssetPool = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(mint_key_str) {
        var _yield$consts$get_bas27, _yield$consts$get_bas28, base_pda, _, poolAccountKey, response;

        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return consts.get_base_pda();

              case 2:
                _yield$consts$get_bas27 = _context28.sent;
                _yield$consts$get_bas28 = _slicedToArray(_yield$consts$get_bas27, 2);
                base_pda = _yield$consts$get_bas28[0];
                _ = _yield$consts$get_bas28[1];
                _context28.next = 8;
                return consts.get_asset_pool_key(base_pda, mint_key_str);

              case 8:
                poolAccountKey = _context28.sent;
                _context28.next = 11;
                return this.connection.getParsedAccountInfo(poolAccountKey);

              case 11:
                response = _context28.sent;
                return _context28.abrupt("return", Parser.parseAssetPool(new Uint8Array(response.value.data)));

              case 13:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function getParsedAssetPool(_x138) {
        return _getParsedAssetPool.apply(this, arguments);
      }

      return getParsedAssetPool;
    }()
  }, {
    key: "getParsedAssetPrice",
    value: function () {
      var _getParsedAssetPrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(mint_key_str) {
        var _yield$consts$get_pri, _yield$consts$get_pri2, price_pda, _, assetPriceKey, response;

        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return consts.get_price_pda();

              case 2:
                _yield$consts$get_pri = _context29.sent;
                _yield$consts$get_pri2 = _slicedToArray(_yield$consts$get_pri, 2);
                price_pda = _yield$consts$get_pri2[0];
                _ = _yield$consts$get_pri2[1];
                _context29.next = 8;
                return consts.get_asset_price_key(price_pda, mint_key_str);

              case 8:
                assetPriceKey = _context29.sent;
                _context29.next = 11;
                return this.connection.getParsedAccountInfo(assetPriceKey);

              case 11:
                response = _context29.sent;
                return _context29.abrupt("return", Parser.parseAssetPrice(new Uint8Array(response.value.data)));

              case 13:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function getParsedAssetPrice(_x139) {
        return _getParsedAssetPrice.apply(this, arguments);
      }

      return getParsedAssetPrice;
    }()
  }, {
    key: "getParsedUserInfo",
    value: function () {
      var _getParsedUserInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(wallet_key) {
        var userInfoKey, response;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return consts.get_user_info_key(wallet_key);

              case 2:
                userInfoKey = _context30.sent;
                _context30.next = 5;
                return this.connection.getParsedAccountInfo(userInfoKey);

              case 5:
                response = _context30.sent;
                return _context30.abrupt("return", Parser.parseUserInfo(new Uint8Array(response.value.data)));

              case 7:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function getParsedUserInfo(_x140) {
        return _getParsedUserInfo.apply(this, arguments);
      }

      return getParsedUserInfo;
    }()
  }, {
    key: "isUserActive",
    value: function () {
      var _isUserActive = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(wallet_key) {
        var userInfoKey, response, user_info;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return consts.get_user_info_key(wallet_key);

              case 2:
                userInfoKey = _context31.sent;
                _context31.next = 5;
                return this.connection.getParsedAccountInfo(userInfoKey);

              case 5:
                response = _context31.sent;

                if (!(response.value === null)) {
                  _context31.next = 8;
                  break;
                }

                return _context31.abrupt("return", false);

              case 8:
                user_info = Parser.parseUserInfo(new Uint8Array(response.value.data));
                return _context31.abrupt("return", user_info.page_id !== consts.INVALID_PAGE);

              case 10:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function isUserActive(_x141) {
        return _isUserActive.apply(this, arguments);
      }

      return isUserActive;
    }()
  }]);

  return ConnWrapper;
}();

exports.ConnWrapper = ConnWrapper;