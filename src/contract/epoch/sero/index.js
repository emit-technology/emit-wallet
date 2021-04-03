"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var SeroContract_1 = require("../../SeroContract");
var config_1 = require("../../../config");
var bignumber_js_1 = require("bignumber.js");
var ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "catg_",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "tkt_",
                "type": "bytes32"
            }
        ],
        "name": "axInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ticket",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "base",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "capacity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "power",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "last",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Types.DeviceInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            }
        ],
        "name": "done",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            }
        ],
        "name": "lockedDevice",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ticket",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "base",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "capacity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "power",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "last",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Types.DeviceInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minPowNE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            },
            {
                "internalType": "uint64",
                "name": "nonce",
                "type": "uint64"
            }
        ],
        "name": "prepare",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "seroAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            }
        ],
        "name": "userInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint16",
                        "name": "scenes",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint64",
                        "name": "settlementPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "currentPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "lastUpdateTime",
                        "type": "uint64"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint64",
                                "name": "serial",
                                "type": "uint64"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "hash",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct Types.PImage",
                        "name": "pImage",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "base",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "capacity",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "rate",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "gene",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct Types.DriverInfo",
                        "name": "driver",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Types.UserInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            },
            {
                "internalType": "uint64",
                "name": "period_",
                "type": "uint64"
            }
        ],
        "name": "userPeriodInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ne",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "total",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pool",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Types.Period[]",
                "name": "_periods",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index(address) {
        var _this = _super.call(this, address, ABI) || this;
        _this.tokenRate = function (gasPrice, gas) { return __awaiter(_this, void 0, void 0, function () {
            var rest, feeAmount, seroAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("tokenRate", [], "")];
                    case 1:
                        rest = _a.sent();
                        feeAmount = new bignumber_js_1.default(1);
                        seroAmount = new bignumber_js_1.default(1);
                        if (rest) {
                            feeAmount = new bignumber_js_1.default(rest[0]);
                            seroAmount = new bignumber_js_1.default(rest[1]);
                        }
                        return [2 /*return*/, feeAmount.multipliedBy(new bignumber_js_1.default(gas).multipliedBy(new bignumber_js_1.default(gasPrice))).dividedBy(seroAmount).toFixed(0, 2)];
                }
            });
        }); };
        _this.prepare = function (scenes, nonce) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.packData("prepare", [scenes, nonce], true)];
            });
        }); };
        _this.done = function (scenes) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.packData("done", [scenes], true)];
            });
        }); };
        _this.userInfo = function (scenes, from) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("userInfo", [scenes], from)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret[0]];
                }
            });
        }); };
        _this.axInfo = function (catg, tkt, from) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("axInfo", [catg, tkt], from)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret[0]];
                }
            });
        }); };
        _this.lockedDevice = function (scenes, from) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("lockedDevice", [scenes], from)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret[0]];
                }
            });
        }); };
        _this.userPeriodInfo = function (scenes, period, from) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("userPeriodInfo", [scenes, period], from)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret[0]];
                }
            });
        }); };
        _this.minPowNE = function () { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("minPowNE", [], "")];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret[0]];
                }
            });
        }); };
        return _this;
    }
    return Index;
}(SeroContract_1.default));
var index = new Index(config_1.CONTRACT_ADDRESS.EPOCH.SERO.SERVICE);
exports.default = index;
