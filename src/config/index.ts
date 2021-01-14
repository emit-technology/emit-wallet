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

export const CONTRACT_ADDRESS: any = {
    ERC20: {
        ETH: {
            USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            eSERO: "0x944854f404c7C0dF9780651D9B29947C89D8fD19"
        },
        SERO: {
            USDT: "3RVjrSqPxVMAHQjANzFEeh5LRfVW7x6Z1MTtDwmb99A6J8uBkYfiHsGkxtThewogGxDEaEsTdZoZDbAKduSN1bc1"
        }
    },
    CROSS: {
        ETH: {
            BRIDGE: "0xefb47ee694e48ca6a2f8a0c4f00b9578d5db647b",
            HANDLE: "0x1382ed0b7c587f7912dfc4a96df8d34c65fe77be",
            FEE: "0x4a6119e5abf0b191b5df50c95f9925f4acbe5692",
        },
        SERO: {
            BRIDGE: "52xsiJFa4ip3KaUJ84KJNcSFSuhNuc5dkrfxtR1UTXvyAHcc6wztfz1QctRgfp4jBNQd7c66k7qzr2mBtehcnjrT",
            HANDLE: "45q6GtTuaeMgkdMWgE225recGEPYjL5W9bCBT83s3DZpxSvuca9rDWTET6W4fiAzckX8nJGn6rz6YXAGWZ2Bk4yZ",
            FEE: "jkfGY4tN9EaJaAT9tc3uKjYLH3tSaTz2zCGwcorabRatJRBrDtFdwz6ASDDnCsWyxFxW6x7RVuVmPhFLxGsRa3u",
        }
    },
}

export const CHAIN_PARAMS:any = {
    baseChain:"mainnet",
    customer:{
        name:"mainnet",
        networkId: 1,
        chainId: 1,
    },
    hardfork:"byzantium"
}

export const GAS_DEFAULT: any = {
    SERO: 25000,
    ETH: 21000
}

export const GAS_PRICE_UNIT: any = {
    SERO: "GTa",
    ETH: "GWei"
}

export const TOKEN_DESC: any = {
    SERO: "Super Zero",
    ETH: "Ethereum",
    USDT: "Tether"
}

export const DECIMAL_CURRENCY: any = {
    CHAIN: {
        CURRENCY: 18
    },
    SERO: {
        SERO: 18,
        EUSDT: 6,
        EWETH: 18,
        USDT: 6,
        ETH: 18
    },
    ETH: {
        SERO: 18,
        eSERO: 18,
        USDT: 6,
        ETH: 18
    }
}

export const CHAIN_FEE: any = {
    CHAIN: {
        GAS: 25000,
        GAS_PRICE: 1e9
    }
}

export const BRIDGE_CURRENCY: any = {
    ETH: {
        ETH: {
            CY: "ETH",
            CY_TYPE: ""
        },
        // SERO: {
        //     CY: "EWETH",
        //     CY_TYPE:"SRC20"
        // }
    },
    USDT: {
        ETH: {
            CY: "USDT",
            CY_TYPE: "ERC20"
        },
        SERO: {
            CY: "EUSDT",
            CY_TYPE: "SRC20"
        }
    },
    SERO: {
        ETH: {
            CY: "eSERO",
            CY_TYPE: "ERC20"
        },
        SERO: {
            CY: "SERO",
            CY_TYPE: ""
        }

    }
}

export const BRIDGE_RESOURCE_ID: any = {
    SERO: "0x0000000000000000000000000000000000000000000000000000005345524f02",
    USDT: "0x0000000000000000000000dac17f958d2ee523a2206206994597c13d831ec701"
}

export const EMIT_HOST:string = "https://node-account.emit.technology";

export const GAS_FEE_PROXY_ADDRESS:any = {
    EUSDT:"2ybhTPwVXLKtA7PGLeL2rzQPctq1j86MxdNemrTSbHwT4yvkoF4L1jLQ1rNtYsoRUsiuvWkiLqi2Hpek8Kzq8uKS"
}