"use strict";
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
var config_1 = require("../config");
var bignumber_js_1 = require("bignumber.js");
var types_1 = require("../types");
var storage_1 = require("../utils/storage");
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
var TronWeb = require('tronweb');
var Tron = /** @class */ (function () {
    function Tron() {
        var _this = this;
        this.transfer = function (to, value, from) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tronWeb.transactionBuilder.sendTrx(to, value, from)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getTxInfo = function (txId) { return __awaiter(_this, void 0, void 0, function () {
            var record, tx, c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        record = {};
                        return [4 /*yield*/, this.tronWeb.trx.getTransaction(txId)
                            // const info = await this.tronWeb.trx.getTransactionInfo(txId)
                        ];
                    case 1:
                        tx = _a.sent();
                        c = tx.raw_data.contract[0];
                        if ("TransferContract" == c.type) {
                            record.from = c.parameter.value.owner_address;
                            record.to = c.parameter.value.to_address;
                            record.value = c.parameter.value.amount;
                        }
                        else if ("TransferAssetContract" == c.type) {
                            record.from = c.parameter.value.owner_address;
                            record.to = c.parameter.value.to_address;
                            record.value = c.parameter.value.amount;
                            //Currency
                        }
                        else if ("CreateSmartContract" == c.type) {
                        }
                        else if ("TriggerSmartContract" == c.type) {
                            record.from = c.parameter.value.owner_address;
                            record.to = c.parameter.value.contract_address;
                            record.value = "0x0";
                        }
                        record.from = this.tronWeb.address.fromHex(record.from);
                        record.to = this.tronWeb.address.fromHex(record.to);
                        return [2 /*return*/, record];
                }
            });
        }); };
        this.getAccountResources = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var resource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tronWeb.trx.getAccountResources(address)];
                    case 1:
                        resource = _a.sent();
                        return [2 /*return*/, resource];
                }
            });
        }); };
        this.getBalanceLocal = function () {
            var key = ["balance", types_1.ChainType.TRON].join("_");
            var data = storage_1.default.getItem(key);
            return data ? data : {};
        };
        this.getBalance = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var rest, balance, frozen, instance, balanceUSDT, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.tronWeb.trx.getAccount(address)];
                    case 1:
                        rest = _a.sent();
                        balance = {};
                        frozen = this.calFrozenBalance(rest);
                        balance["TRX"] = rest.balance;
                        balance["TRX_FROZEN"] = frozen;
                        return [4 /*yield*/, this.tronWeb.contract().at(config_1.CONTRACT_ADDRESS.ERC20.TRON.USDT)];
                    case 2:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.balanceOf(address).call()];
                    case 3:
                        balanceUSDT = _a.sent();
                        balance["USDT"] = new bignumber_js_1.default(balanceUSDT._hex).toString(10);
                        return [2 /*return*/, Promise.resolve(balance)];
                    case 4:
                        e_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.calFrozenBalance = function (data) {
            var total = 0;
            if (data.account_resource && data.account_resource.frozen_balance_for_energy) {
                total += data.account_resource.frozen_balance_for_energy.frozen_balance;
            }
            if (data.frozen && data.frozen.length > 0) {
                for (var _i = 0, _a = data.frozen; _i < _a.length; _i++) {
                    var d = _a[_i];
                    total += d.frozen_balance;
                }
            }
            return total;
        };
        var HttpProvider = TronWeb.providers.HttpProvider;
        var fullNode = new HttpProvider(config_1.TRON_API_HOST.fullNode);
        var solidityNode = new HttpProvider(config_1.TRON_API_HOST.fullNode);
        var eventServer = new HttpProvider(config_1.TRON_API_HOST.fullNode);
        var tronWeb = new TronWeb(fullNode, solidityNode, eventServer, "67cf7062cc23b5165d5b47578e2afcfab8eeb3e906d92fc5ea7ea816e7b51831");
        this.tronWeb = tronWeb;
    }
    return Tron;
}());
var tron = new Tron();
exports.default = tron;
