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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainId = exports.ChainType = void 0;
var ChainType;
(function (ChainType) {
    ChainType[ChainType["_"] = 0] = "_";
    ChainType[ChainType["SERO"] = 1] = "SERO";
    ChainType[ChainType["ETH"] = 2] = "ETH";
    ChainType[ChainType["TRON"] = 3] = "TRON";
})(ChainType = exports.ChainType || (exports.ChainType = {}));
var ChainId;
(function (ChainId) {
    ChainId[ChainId["_"] = 0] = "_";
    ChainId[ChainId["ETH"] = 1] = "ETH";
    ChainId[ChainId["SERO"] = 2] = "SERO";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
