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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainId = exports.ChainType = void 0;
var ChainType;
(function (ChainType) {
    ChainType[ChainType["_"] = 0] = "_";
    ChainType[ChainType["SERO"] = 1] = "SERO";
    ChainType[ChainType["ETH"] = 2] = "ETH";
    ChainType[ChainType["TRON"] = 3] = "TRON";
    ChainType[ChainType["BSC"] = 4] = "BSC";
})(ChainType = exports.ChainType || (exports.ChainType = {}));
var ChainId;
(function (ChainId) {
    ChainId[ChainId["_"] = 0] = "_";
    ChainId[ChainId["ETH"] = 1] = "ETH";
    ChainId[ChainId["SERO"] = 2] = "SERO";
    ChainId[ChainId["TRON"] = 3] = "TRON";
    ChainId[ChainId["BSC"] = 4] = "BSC";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
__exportStar(require("./stargrid"), exports);
