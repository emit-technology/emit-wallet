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

import * as config from "../config";
import SeroToken from "../contract/erc20/sero";
import EthToken from "../contract/erc20/eth";

import SeroCross from "../contract/cross/sero";
import EthCross from "../contract/cross/eth";

// export const USDT_ETH:EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH.USDT)
// export const USDT_SERO:SeroToken = new SeroToken(config.CONTRACT_ADDRESS.ERC20.SERO.USDT)
//
// export const CROSS_SERO:SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE)
// export const CROSS_ETH:EthCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE)