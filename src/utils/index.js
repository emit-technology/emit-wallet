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
exports.isEmbedPopup = exports.getQueryString = exports.getChainFullName = exports.getCrossChainByCy = exports.defaultCy = exports.getPrefix = exports.notCrossToken = exports.hexToCy = exports.isNFTAddress = exports.getAddressByCategory = exports.getAddressBySymbol = exports.getCategoryBySymbol = exports.defaultGasPrice = exports.IsAPP = exports.getMobileOperatingSystem = exports.getEthCyByContractAddress = exports.getExplorerBlockUrl = exports.getExplorerTxUrl = exports.getCrossEventStatus = exports.getCyDisplayName = exports.getCyType = exports.gasUnit = exports.defaultGas = exports.formatDate = exports.toHex = exports.getDestinationChainIDByName = exports.getChainIdByName = exports.getCyName = exports.getCrossTargetAddress = exports.getNFTResourceId = exports.getResourceId = exports.getDestinationChainID = exports.needApproved = exports.getCyDecimal = exports.toValue = exports.fromValue = exports.arrayToObject = exports.ellipsisStr = exports.bs58ToHex = void 0;
var bignumber_js_1 = require("bignumber.js");
var config_1 = require("../config");
var types_1 = require("../types");
var rpc_1 = require("../rpc");
var utils = require("../utils");
var storage_1 = require("./storage");
var utf8 = require("utf8");
var BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58 = require("base-x")(BASE58);
function bs58ToHex(value) {
    var bytes = bs58.decode(value);
    return "0x" + bytes.toString("hex");
}
exports.bs58ToHex = bs58ToHex;
function ellipsisStr(v) {
    if (!v)
        return "";
    if (v.length >= 15) {
        return v.slice(0, 7) + " ... " + v.slice(v.length - 7, v.length);
    }
    return v;
}
exports.ellipsisStr = ellipsisStr;
function arrayToObject(arr) {
    var ret = {};
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var o = arr_1[_i];
        ret[o.currency] = o.value;
    }
    return ret;
}
exports.arrayToObject = arrayToObject;
function fromValue(value, decimal) {
    if (!value) {
        return new bignumber_js_1.default(0);
    }
    return new bignumber_js_1.default(value).dividedBy(Math.pow(10, decimal));
}
exports.fromValue = fromValue;
function toValue(value, decimal) {
    if (!value) {
        return new bignumber_js_1.default(0);
    }
    return new bignumber_js_1.default(value).multipliedBy(Math.pow(10, decimal));
}
exports.toValue = toValue;
function getCyDecimal(cy, chainName) {
    try {
        if (!cy || !chainName) {
            return 0;
        }
        return config_1.DECIMAL_CURRENCY[chainName][cy];
    }
    catch (e) {
        console.log(e);
    }
    return 0;
}
exports.getCyDecimal = getCyDecimal;
function needApproved(chain) {
    if (types_1.ChainType.ETH == chain || types_1.ChainType.TRON == chain || types_1.ChainType.BSC == chain) {
        return true;
    }
    return false;
}
exports.needApproved = needApproved;
function getDestinationChainID(chain) {
    if (chain == types_1.ChainType.TRON) {
        return types_1.ChainId.TRON;
    }
    else if (chain == types_1.ChainType.ETH) {
        return types_1.ChainId.ETH;
    }
    else if (chain == types_1.ChainType.SERO) {
        return types_1.ChainId.SERO;
    }
    else if (chain == types_1.ChainType.BSC) {
        return types_1.ChainId.BSC;
    }
    return types_1.ChainId._;
}
exports.getDestinationChainID = getDestinationChainID;
function getResourceId(cy, from, to) {
    return config_1.BRIDGE_CURRENCY[cy][from]["RESOURCE_ID"][to];
}
exports.getResourceId = getResourceId;
function getNFTResourceId(symbol) {
    return config_1.BRIDGE_NFT_RESOURCE_ID[symbol];
}
exports.getNFTResourceId = getNFTResourceId;
function getCrossTargetAddress(resourceId, destinationChainID) {
    var keys = Object.keys(config_1.BRIDGE_NFT_RESOURCE_ID);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        if (config_1.BRIDGE_NFT_RESOURCE_ID[k] == resourceId) {
            return config_1.CONTRACT_ADDRESS.ERC721[k]["ADDRESS"][types_1.ChainId[destinationChainID]];
        }
    }
    return "";
}
exports.getCrossTargetAddress = getCrossTargetAddress;
function getCyName(cy, chain) {
    try {
        return config_1.BRIDGE_CURRENCY[cy][chain]["CY"];
    }
    catch (e) {
        console.log(e);
    }
    return "";
}
exports.getCyName = getCyName;
function getChainIdByName(chain) {
    for (var key in types_1.ChainType) {
        if (types_1.ChainType[key] === chain) {
            return key;
        }
    }
    return types_1.ChainType._;
}
exports.getChainIdByName = getChainIdByName;
function getDestinationChainIDByName(chain) {
    for (var key in types_1.ChainId) {
        if (types_1.ChainId[key] === chain) {
            return key;
        }
    }
    return types_1.ChainId._;
}
exports.getDestinationChainIDByName = getDestinationChainIDByName;
function toHex(value) {
    if (value === "0x") {
        return "0x0";
    }
    return "0x" + new bignumber_js_1.default(value).toString(16);
}
exports.toHex = toHex;
function formatDate(timestamp) {
    var date = new Date(timestamp);
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
exports.formatDate = formatDate;
function defaultGas(chain) {
    return config_1.GAS_DEFAULT[types_1.ChainType[chain]];
}
exports.defaultGas = defaultGas;
function gasUnit(chain) {
    return config_1.GAS_PRICE_UNIT[types_1.ChainType[chain]];
}
exports.gasUnit = gasUnit;
function getCyType(chain, cy) {
    return config_1.BRIDGE_CURRENCY[cy][chain]["CY_TYPE"];
}
exports.getCyType = getCyType;
function getCyDisplayName(key) {
    if (config_1.DISPLAY_NAME[key]) {
        return config_1.DISPLAY_NAME[key];
    }
    else {
        return key;
    }
}
exports.getCyDisplayName = getCyDisplayName;
function getCrossEventStatus(status) {
    //{Inactive, Active, Passed, Executed, Cancelled}
    if (status == "1") {
        return "Active";
    }
    else if (status == "2") {
        return "Passed";
    }
    else if (status == "3") {
        return "Executed";
    }
    else if (status == "4") {
        return "Cancelled";
    }
    else {
        return "Deposited";
    }
}
exports.getCrossEventStatus = getCrossEventStatus;
function getExplorerTxUrl(chain, hash) {
    if (chain == types_1.ChainType.ETH) {
        if (new Date().getTimezoneOffset() / 60 == -8) {
            return "" + config_1.EXPLORER_URL.TRANSACTION.ETH.CN + hash;
        }
        else {
            return "" + config_1.EXPLORER_URL.TRANSACTION.ETH.EN + hash;
        }
    }
    return config_1.EXPLORER_URL.TRANSACTION[types_1.ChainType[chain]] + hash;
}
exports.getExplorerTxUrl = getExplorerTxUrl;
function getExplorerBlockUrl(chain, hash, num) {
    if (chain == types_1.ChainType.ETH) {
        if (new Date().getTimezoneOffset() / 60 == -8) {
            return "" + config_1.EXPLORER_URL.BLOCK.ETH.CN + num;
        }
        else {
            return "" + config_1.EXPLORER_URL.BLOCK.ETH.EN + num;
        }
    }
    return config_1.EXPLORER_URL.BLOCK[types_1.ChainType[chain]] + num;
}
exports.getExplorerBlockUrl = getExplorerBlockUrl;
function getEthCyByContractAddress(address) {
    var keys = Object.keys(config_1.CONTRACT_ADDRESS.ERC20.ETH);
    // const keys2 = Object.keys(CONTRACT_ADDRESS.CROSS.ETH);
    // const keys = keys1.concat(keys2);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        if (config_1.CONTRACT_ADDRESS.ERC20.ETH[key] && config_1.CONTRACT_ADDRESS.ERC20.ETH[key].toLowerCase() == address.toLowerCase()) {
            return key;
        }
        // if(CONTRACT_ADDRESS.CROSS.ETH[key] && CONTRACT_ADDRESS.CROSS.ETH[key].toLowerCase() == address.toLowerCase()){
        //     return key
        // }
    }
    return "ETH";
}
exports.getEthCyByContractAddress = getEthCyByContractAddress;
/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    // @ts-ignore
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
}
exports.getMobileOperatingSystem = getMobileOperatingSystem;
function IsAPP() {
    return getMobileOperatingSystem() == "iOS" || getMobileOperatingSystem() == "Android";
}
exports.IsAPP = IsAPP;
function defaultGasPrice(chain) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var defaultGasPrice, data, defaultGasPrice_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = {};
                    if (!(chain == types_1.ChainType.ETH)) return [3 /*break*/, 2];
                    return [4 /*yield*/, rpc_1.default.post("eth_gasTracker", [], chain)];
                case 1:
                    // @ts-ignore
                    data = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(chain == types_1.ChainType.BSC)) return [3 /*break*/, 4];
                    return [4 /*yield*/, rpc_1.default.post("eth_gasPrice", [], chain)];
                case 3:
                    defaultGasPrice_1 = _b.sent();
                    data = {
                        AvgGasPrice: {
                            gasPrice: utils.fromValue(defaultGasPrice_1, 9).toString(10),
                            second: 3,
                        }
                    };
                    return [3 /*break*/, 5];
                case 4:
                    if (chain == types_1.ChainType.SERO) {
                        data = {
                            AvgGasPrice: {
                                gasPrice: "1",
                                second: 15,
                            }
                        };
                    }
                    else if (chain == types_1.ChainType.TRON) {
                        //TODO
                    }
                    _b.label = 5;
                case 5:
                    defaultGasPrice = data.AvgGasPrice ? (_a = data.AvgGasPrice) === null || _a === void 0 ? void 0 : _a.gasPrice : "1";
                    return [2 /*return*/, defaultGasPrice];
            }
        });
    });
}
exports.defaultGasPrice = defaultGasPrice;
function getCategoryBySymbol(symbol, chain) {
    return config_1.CONTRACT_ADDRESS.ERC721[symbol]["SYMBOL"][chain];
}
exports.getCategoryBySymbol = getCategoryBySymbol;
function getAddressBySymbol(symbol, chain) {
    return config_1.CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"][chain];
}
exports.getAddressBySymbol = getAddressBySymbol;
function getAddressByCategory(category, chain) {
    var keys = Object.keys(config_1.CONTRACT_ADDRESS.ERC721);
    for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
        var k = keys_3[_i];
        var address = config_1.CONTRACT_ADDRESS.ERC721[k]["ADDRESS"];
        var symbol = config_1.CONTRACT_ADDRESS.ERC721[k]["SYMBOL"];
        if (symbol[chain] == category) {
            return address[chain];
        }
    }
    return "";
}
exports.getAddressByCategory = getAddressByCategory;
function isNFTAddress(add, chain) {
    var keys = Object.keys(config_1.CONTRACT_ADDRESS.ERC721);
    for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
        var k = keys_4[_i];
        var address = config_1.CONTRACT_ADDRESS.ERC721[k]["ADDRESS"];
        // const symbol = CONTRACT_ADDRESS.ERC721[k]["SYMBOL"];
        if (address[chain].toLowerCase() == add.toLowerCase()) {
            return true;
        }
    }
    return false;
}
exports.isNFTAddress = isNFTAddress;
function hexToUtf8(hex) {
    var string = "";
    var code = 0;
    hex = hex.replace(/^0x/i, "");
    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, "");
    hex = hex
        .split("")
        .reverse()
        .join("");
    hex = hex.replace(/^(?:00)*/, "");
    hex = hex
        .split("")
        .reverse()
        .join("");
    var l = hex.length;
    for (var i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        // if (code !== 0) {
        string += String.fromCharCode(code);
        // }
    }
    return utf8.decode(string);
}
function hexToCy(str) {
    return hexToUtf8(str).toUpperCase();
}
exports.hexToCy = hexToCy;
function notCrossToken(cy) {
    return config_1.NOT_CROSS_TOKEN.indexOf(cy) == -1;
}
exports.notCrossToken = notCrossToken;
function getPrefix(chain) {
    if (chain == types_1.ChainType.BSC) {
        return "eth";
    }
    else {
        return types_1.ChainType[chain].toLowerCase();
    }
}
exports.getPrefix = getPrefix;
function defaultCy(chain) {
    if (chain == types_1.ChainType.BSC) {
        return "BNB";
    }
    else {
        return types_1.ChainType[chain];
    }
}
exports.defaultCy = defaultCy;
function getCrossChainByCy(cy) {
    var obj = config_1.BRIDGE_CURRENCY[cy];
    if (obj) {
        var keys = Object.keys(obj);
        var arr = [];
        for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
            var k = keys_5[_i];
            for (var _a = 0, keys_6 = keys; _a < keys_6.length; _a++) {
                var j = keys_6[_a];
                if (k !== j && (!obj[k].EXCEPT || obj[k].EXCEPT.indexOf(j) == -1)) {
                    arr.push({
                        from: k,
                        to: j
                    });
                }
            }
        }
        return arr;
    }
    return [{}];
}
exports.getCrossChainByCy = getCrossChainByCy;
function getChainFullName(chain) {
    if (config_1.FULL_NAME[types_1.ChainType[chain]]) {
        return config_1.FULL_NAME[types_1.ChainType[chain]];
    }
    return types_1.ChainType[chain];
}
exports.getChainFullName = getChainFullName;
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return '';
}
exports.getQueryString = getQueryString;
function isEmbedPopup() {
    return utils.getQueryString("embed") == "popup" || storage_1.default.getItem("embed") == "popup";
}
exports.isEmbedPopup = isEmbedPopup;
