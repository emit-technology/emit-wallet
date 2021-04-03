"use strict";
/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var config_1 = require("../config");
var types_1 = require("../types");
var walletWorker_1 = require("../worker/walletWorker");
var storage_1 = require("../utils/storage");
var tron_1 = require("./tron");
var eth_1 = require("../contract/erc721/meta/eth");
var sero_1 = require("../contract/erc721/meta/sero");
var utils = require("../utils");
var RPC = /** @class */ (function () {
    function RPC(host) {
        var _this = this;
        this.req = function (url, data) { return __awaiter(_this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(this.host, data)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                }
            });
        }); };
        this.getTicket = function (chain, address) { return __awaiter(_this, void 0, void 0, function () {
            var tKey, item;
            return __generator(this, function (_a) {
                tKey = ["ticket", chain].join("_");
                item = storage_1.default.getItem(tKey);
                if (chain == types_1.ChainType.SERO) {
                    this.getTicketSero(address).catch(function (e) {
                        console.error("getTicketSero err:", e);
                    });
                }
                else if (chain == types_1.ChainType.ETH) {
                    this.getTicketEth(address).catch(function (e) {
                        console.error("getTicketEth err:", e);
                    });
                }
                return [2 /*return*/, item];
            });
        }); };
        this.getTicketEth = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var tKey, keys, ret, _i, keys_1, key, contract, balance, symbol, tokenArr, i, tokenId, uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tKey = ["ticket", types_1.ChainType.ETH].join("_");
                        keys = Object.keys(config_1.CONTRACT_ADDRESS.ERC721);
                        ret = {};
                        _i = 0, keys_1 = keys;
                        _a.label = 1;
                    case 1:
                        if (!(_i < keys_1.length)) return [3 /*break*/, 10];
                        key = keys_1[_i];
                        contract = new eth_1.default(config_1.CONTRACT_ADDRESS.ERC721[key]["ADDRESS"]["ETH"], types_1.ChainType.ETH);
                        return [4 /*yield*/, contract.balanceOf(address)];
                    case 2:
                        balance = _a.sent();
                        return [4 /*yield*/, contract.symbol()];
                    case 3:
                        symbol = _a.sent();
                        tokenArr = [];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < balance)) return [3 /*break*/, 8];
                        return [4 /*yield*/, contract.tokenOfOwnerByIndex(address, i)];
                    case 5:
                        tokenId = _a.sent();
                        return [4 /*yield*/, contract.tokenURI(tokenId)];
                    case 6:
                        uri = _a.sent();
                        tokenArr.push({
                            tokenId: tokenId,
                            uri: uri
                        });
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 4];
                    case 8:
                        ret[symbol] = tokenArr;
                        _a.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10:
                        storage_1.default.setItem(tKey, ret);
                        return [2 /*return*/];
                }
            });
        }); };
        this.getTicketSero = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var tKey, keys, ret, seroData, _i, keys_2, key, contract, rest, symbol, balance, tokenArr, _a, balance_1, d, uri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tKey = ["ticket", types_1.ChainType.SERO].join("_");
                        keys = Object.keys(config_1.CONTRACT_ADDRESS.ERC721);
                        ret = {};
                        return [4 /*yield*/, this.post(["sero", "getTicket"].join("_"), [address], types_1.ChainType.SERO)];
                    case 1:
                        seroData = _b.sent();
                        _i = 0, keys_2 = keys;
                        _b.label = 2;
                    case 2:
                        if (!(_i < keys_2.length)) return [3 /*break*/, 9];
                        key = keys_2[_i];
                        contract = new sero_1.default(config_1.CONTRACT_ADDRESS.ERC721[key]["ADDRESS"]["SERO"]);
                        return [4 /*yield*/, contract.symbol()];
                    case 3:
                        rest = _b.sent();
                        symbol = rest[0];
                        balance = seroData[symbol];
                        if (!(balance && balance.length > 0)) return [3 /*break*/, 8];
                        tokenArr = [];
                        _a = 0, balance_1 = balance;
                        _b.label = 4;
                    case 4:
                        if (!(_a < balance_1.length)) return [3 /*break*/, 7];
                        d = balance_1[_a];
                        return [4 /*yield*/, contract.tokenURI(d)];
                    case 5:
                        uri = _b.sent();
                        tokenArr.push({
                            tokenId: d,
                            uri: uri
                        });
                        _b.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 4];
                    case 7:
                        ret[symbol] = tokenArr;
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        storage_1.default.setItem(tKey, ret);
                        return [2 /*return*/];
                }
            });
        }); };
        this.getBalance = function (chain, address, localOnly) { return __awaiter(_this, void 0, void 0, function () {
            var key, rest, prefix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = ["balance", chain].join("_");
                        rest = storage_1.default.getItem(key);
                        prefix = utils.getPrefix(chain);
                        if (!!rest) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.post([prefix, "getBalance"].join("_"), [address], chain)];
                    case 1:
                        rest = _a.sent();
                        storage_1.default.setItem(key, rest);
                        return [3 /*break*/, 3];
                    case 2:
                        if (!localOnly) {
                            if (chain == types_1.ChainType.TRON) {
                                tron_1.default.getBalance(address).then(function (balance) {
                                    storage_1.default.setItem(key, balance);
                                });
                            }
                            else {
                                this.post([prefix, "getBalance"].join("_"), [address], chain).then(function (balance) {
                                    storage_1.default.setItem(key, balance);
                                });
                            }
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, rest];
                }
            });
        }); };
        this.getTransactions = function (chain, address, cy, hash, pageSize, pageNo, fingerprint) { return __awaiter(_this, void 0, void 0, function () {
            var prefix, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefix = utils.getPrefix(chain);
                        return [4 /*yield*/, this.post([prefix, "getTransactions"].join("_"), [address, cy, hash, pageSize, pageNo, fingerprint], chain)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        }); };
        this.getTxInfo = function (chain, txHash) { return __awaiter(_this, void 0, void 0, function () {
            var prefix, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefix = utils.getPrefix(chain);
                        return [4 /*yield*/, this.post([prefix, "getTxInfo"].join("_"), [txHash], chain)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        }); };
        this.getEvents = function (chain, txHash, depositNonce, originChainID, resourceID) { return __awaiter(_this, void 0, void 0, function () {
            var prefix, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefix = utils.getPrefix(chain);
                        return [4 /*yield*/, this.post([prefix, "getEvents"].join("_"), [txHash, depositNonce, originChainID, resourceID], chain)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        }); };
        this.commitTx = function (tx, password) { return __awaiter(_this, void 0, void 0, function () {
            var accountId, hash, txParams, signSeroRet, _a, signEthRet, _b, signEthRet, signEthRet, rest;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        accountId = storage_1.default.getItem("accountId");
                        if (!accountId) return [3 /*break*/, 18];
                        hash = "";
                        if (!(tx.chain == types_1.ChainType.SERO)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.post("sero_genParams", [tx], tx.chain)];
                    case 1:
                        txParams = _c.sent();
                        return [4 /*yield*/, walletWorker_1.default.signTx(accountId, password, types_1.ChainType.SERO, txParams)
                            //commitTx
                        ];
                    case 2:
                        signSeroRet = _c.sent();
                        //commitTx
                        return [4 /*yield*/, this.post("sero_commitTx", [signSeroRet, tx], tx.chain)];
                    case 3:
                        //commitTx
                        _c.sent();
                        hash = signSeroRet.Hash;
                        return [3 /*break*/, 17];
                    case 4:
                        if (!(tx.chain == types_1.ChainType.ETH)) return [3 /*break*/, 9];
                        if (!!tx.nonce) return [3 /*break*/, 6];
                        // @ts-ignore
                        _a = tx;
                        return [4 /*yield*/, this.post("eth_getTransactionCount", [tx.from, "pending"], tx.chain)];
                    case 5:
                        // @ts-ignore
                        _a.nonce = _c.sent();
                        _c.label = 6;
                    case 6: return [4 /*yield*/, walletWorker_1.default.signTx(accountId, password, types_1.ChainType.ETH, tx, config_1.CHAIN_PARAMS)
                        //commitTx
                    ];
                    case 7:
                        signEthRet = _c.sent();
                        return [4 /*yield*/, this.post("eth_commitTx", ["0x" + signEthRet, tx], tx.chain)];
                    case 8:
                        //commitTx
                        hash = _c.sent();
                        return [3 /*break*/, 17];
                    case 9:
                        if (!(tx.chain == types_1.ChainType.BSC)) return [3 /*break*/, 14];
                        if (!!tx.nonce) return [3 /*break*/, 11];
                        // @ts-ignore
                        _b = tx;
                        return [4 /*yield*/, this.post("eth_getTransactionCount", [tx.from, "pending"], tx.chain)];
                    case 10:
                        // @ts-ignore
                        _b.nonce = _c.sent();
                        _c.label = 11;
                    case 11: return [4 /*yield*/, walletWorker_1.default.signTx(accountId, password, types_1.ChainType.ETH, tx, config_1.CHAIN_PARAMS_BSC)
                        //commitTx
                    ];
                    case 12:
                        signEthRet = _c.sent();
                        return [4 /*yield*/, this.post("eth_commitTx", ["0x" + signEthRet, tx], tx.chain)];
                    case 13:
                        //commitTx
                        hash = _c.sent();
                        return [3 /*break*/, 17];
                    case 14:
                        if (!(tx.chain == types_1.ChainType.TRON)) return [3 /*break*/, 17];
                        return [4 /*yield*/, walletWorker_1.default.signTx(accountId, password, types_1.ChainType.TRON, tx.data)];
                    case 15:
                        signEthRet = _c.sent();
                        return [4 /*yield*/, this.post("tron_commitTx", [signEthRet, tx], tx.chain)];
                    case 16:
                        rest = _c.sent();
                        hash = rest.txid;
                        _c.label = 17;
                    case 17: return [2 /*return*/, Promise.resolve(hash)];
                    case 18: return [2 /*return*/, Promise.reject("Account not exist!")];
                }
            });
        }); };
        this.messageId = 0;
        this.host = host;
    }
    RPC.prototype.post = function (method, params, chain) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                data = {
                    id: this.messageId++,
                    jsonrpc: '2.0',
                    method: method,
                    params: params,
                };
                if (chain) {
                    axios_1.default.defaults.headers.post['chain'] = chain;
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        axios_1.default.post(_this.host, data, {
                            headers: {}
                        }).then(function (resp) {
                            if (resp.data.error) {
                                reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                            }
                            else {
                                resolve(resp.data.result);
                            }
                        }).catch(function (e) {
                            console.error("rpc post err: ", e);
                            reject(e);
                        });
                    })];
            });
        });
    };
    return RPC;
}());
var rpc = new RPC(config_1.EMIT_HOST);
exports.default = rpc;
