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
exports.__esModule = true;
var index_1 = require("walletService/src/index");
var types_1 = require("../types");
var storage_1 = require("../utils/storage");
var url_1 = require("../utils/url");
var WalletWorker = /** @class */ (function () {
    function WalletWorker() {
        var _this = this;
        this.accountInfoAsync = function () { return __awaiter(_this, void 0, void 0, function () {
            var accountId;
            return __generator(this, function (_a) {
                accountId = storage_1["default"].getItem("accountId");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].accountInfo(accountId, function (data) {
                            if (data.error) {
                                reject(data.error);
                                console.log(data.error);
                            }
                            else {
                                var tmp = data.result;
                                tmp.addresses[types_1.ChainType.BSC] = tmp.addresses[types_1.ChainType.ETH];
                                storage_1["default"].setItem(accountId, tmp);
                                resolve(tmp);
                            }
                        });
                    })];
            });
        }); };
    }
    WalletWorker.prototype.importMnemonic = function (mnemonic, name, password, passwordHint, avatar) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    mnemonic: mnemonic,
                    password: password,
                    passwordHint: passwordHint,
                    avatar: avatar,
                    name: name
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].importMnemonic(params, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.importPrivateKey = function (privateKey, name, password, passwordHint, avatar) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    mnemonic: privateKey,
                    password: password,
                    passwordHint: passwordHint,
                    avatar: avatar,
                    name: name
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].importPrivateKey(params, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.generateMnemonic = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].generateMnemonic(function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.exportMnemonic = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].exportMnemonic(accountId, password, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.exportKeystore = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].exportKeystore(accountId, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.exportPrivateKey = function (accountId, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].exportPrivateKey(accountId, password, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.accounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].accounts(function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.accountInfo = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!accountId) {
                    accountId = storage_1["default"].getItem("accountId");
                }
                this.isLocked().then(function (ret) {
                    var urlHash = window.location.hash;
                    if (ret && urlHash.indexOf("account/unlock") == -1) {
                        url_1["default"].accountUnlock();
                    }
                });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (accountId) {
                            var data = storage_1["default"].getItem(accountId);
                            if (data) {
                                if (!data.addresses[types_1.ChainType.BSC]) {
                                    data.addresses[types_1.ChainType.BSC] = data.addresses[types_1.ChainType.ETH];
                                }
                                resolve(data);
                            }
                            index_1["default"].accountInfo(accountId, function (data) {
                                if (data.error) {
                                    reject(data.error);
                                }
                                else {
                                    var tmp = data.result;
                                    tmp.addresses[types_1.ChainType.BSC] = tmp.addresses[types_1.ChainType.ETH];
                                    storage_1["default"].setItem(accountId, tmp);
                                    resolve(tmp);
                                }
                            });
                        }
                        else {
                            reject("Account not asset!");
                        }
                    })];
            });
        });
    };
    WalletWorker.prototype.signTx = function (accountId, password, chainType, params, chainParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].signTx(accountId, password, chainType, params, chainParams, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.genNewWallet = function (accountId, password, chainType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].genNewWallet({ accountId: accountId, password: password, chainType: chainType }, function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    WalletWorker.prototype.unlockWallet = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.accountInfo()];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                index_1["default"].unlockWallet(account.accountId, password, function (data) {
                                    if (data.error) {
                                        reject(data.error);
                                    }
                                    else {
                                        resolve(data.result);
                                    }
                                });
                            })];
                }
            });
        });
    };
    WalletWorker.prototype.isLocked = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        index_1["default"].isLocked(function (data) {
                            if (data.error) {
                                reject(data.error);
                            }
                            else {
                                resolve(data.result);
                            }
                        });
                    })];
            });
        });
    };
    return WalletWorker;
}());
var walletWorker = new WalletWorker();
exports["default"] = walletWorker;
