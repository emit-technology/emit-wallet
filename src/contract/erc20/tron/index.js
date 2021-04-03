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
var tron_1 = require("../../../rpc/tron");
var Tron = /** @class */ (function () {
    function Tron(address) {
        var _this = this;
        this.address = "";
        this.contract = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tron_1.default.tronWeb.contract().at(this.address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.allowance = function (owner, spender) { return __awaiter(_this, void 0, void 0, function () {
            var contract, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.allowance(owner, spender).call()];
                    case 2:
                        rest = _a.sent();
                        return [2 /*return*/, rest.remaining.toNumber()];
                }
            });
        }); };
        this.approve = function (spender, value, from) { return __awaiter(_this, void 0, void 0, function () {
            var parameter, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameter = [{ type: 'address', value: tron_1.default.tronWeb.address.toHex(spender) }, { type: 'uint256', value: value.toNumber() }];
                        return [4 /*yield*/, tron_1.default.tronWeb.transactionBuilder.triggerSmartContract(this.address, "approve(address,uint256)", {}, parameter, tron_1.default.tronWeb.address.toHex(from))];
                    case 1:
                        transaction = _a.sent();
                        if (transaction.result.result) {
                            return [2 /*return*/, Promise.resolve(transaction.transaction)];
                        }
                        return [2 /*return*/, Promise.reject("gen transaction obj failed")];
                }
            });
        }); };
        this.balanceOf = function (who) { return __awaiter(_this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.balanceOf(who).call()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.totalSupply = function () { return __awaiter(_this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.totalSupply().call()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.transfer = function (to, value, from) { return __awaiter(_this, void 0, void 0, function () {
            var parameter, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameter = [{ type: 'address', value: tron_1.default.tronWeb.address.toHex(to) }, { type: 'uint256', value: value.toNumber() }];
                        return [4 /*yield*/, tron_1.default.tronWeb.transactionBuilder.triggerSmartContract(this.address, "transfer(address,uint256)", {}, parameter, tron_1.default.tronWeb.address.toHex(from))];
                    case 1:
                        transaction = _a.sent();
                        if (transaction.result.result) {
                            return [2 /*return*/, Promise.resolve(transaction.transaction)];
                        }
                        return [2 /*return*/, Promise.reject("gen transaction obj failed")];
                }
            });
        }); };
        //not invoke
        this.transferFrom = function (from, to, value) { return __awaiter(_this, void 0, void 0, function () {
            var parameter, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameter = [
                            { type: 'address', value: tron_1.default.tronWeb.address.toHex(from) },
                            { type: 'address', value: tron_1.default.tronWeb.address.toHex(to) },
                            { type: 'uint256', value: value.toNumber() }
                        ];
                        return [4 /*yield*/, tron_1.default.tronWeb.transactionBuilder.triggerSmartContract(this.address, "transferFrom(address,address,uint256)", {}, parameter, tron_1.default.tronWeb.address.toHex(from))];
                    case 1:
                        transaction = _a.sent();
                        if (transaction.result.result) {
                            return [2 /*return*/, Promise.resolve(transaction.transaction)];
                        }
                        return [2 /*return*/, Promise.reject("gen transaction obj failed")];
                }
            });
        }); };
        this.address = address;
    }
    return Tron;
}());
exports.default = Tron;
