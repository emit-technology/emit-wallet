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
            USDT: "0x793359af58fa92e0beb08f37e509071c42dcc32c",
            eSERO: "0xe462e7697F2fb33DE4eb46665D4E7D29DA647816",
            WBTC: "0x50395D1b70d8a73eF350AEbFE6278a212B018Ade",
            WETH: "0xE69B7b16AD568BDF11924C0b471176553e9AD1aF"
        },
        TRON: {
            USDT: "TCUnjCxPqwE2SB9vRo8oNwDZx9b7DxAkbv",
        }
    },
    CROSS: {
        ETH: {
            BRIDGE: "0xC7c287200D0952d4f591509463fD5203C7D88F56",
            HANDLE: "0xB47E605e2daAfBD2A3F44216c47033FE71c96A2F",
            FEE: "0x622eC769d63465eE56E5a994826E323080C56B39",
        },
        TRON: {
            BRIDGE: "TNstBgWNyCMxnkbZzCe3eAyiYiuY45sPTi",
            HANDLE: "TDrooxL5EgHRJR6rMU24oEQYrGGbXmGJRL",
            FEE: "TP2qWxhgDhA6RkFgqMqYQjQLVePxBgLppC",
        },
        SERO: {
            BRIDGE: "tCWmQ5NbUxm2y7HxZaKrfd3KzaLehyTFHPdqq5vPdj4rFHig23kNxNG7Y3Dk2ST3YS1D9GoUtaNskR3xsDobTbz",
            HANDLE: "2HwsEHQEDTt68r3TB6Q4hCZGprafiwxjvhj31zVJNTbStUogNeLKeXcVWAiGq4zDSqP2qibJLdeHr7YJZkovgs52",
            FEE: "4sgmyfwsd4DL5b1e2YHjrseFCnHsk1LTBdLJh5husqpyugRkSkNDW4FGXze4fWb3SwFGzT5o1rC8FUN2DQmL7iHU",
        }
    }
}

export const CHAIN_PARAMS:any = {
    baseChain:"mainnet",
    customer:{
        networkId: 15,
        chainId: 1337,
    },
    hardfork:"petersburg"
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
    USDT: "Tether",
    WBTC:"Wrapped BTC",
    WETH: "Wrapped ETH",
    TUSDT: "TRON USDT",
    TRX: "TRON NETWORK"
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
        ETH: 18,
        EWBTC: 8,
        TUSDT:6,
    },
    ETH: {
        SERO: 18,
        eSERO: 18,
        USDT: 6,
        ETH: 18,
        WBTC:8,
        WETH:18
    },
    TRON:{
        TRX:6,
        USDT:6
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
    TRX: {
        TRON: {
            CY: "TRX",
            CY_TYPE: ""
        }
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
    TUSDT: {
        TRON: {
            CY: "USDT",
            CY_TYPE: "TRC20"
        },
        SERO: {
            CY: "TUSDT",
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

    },
    WBTC :{
        ETH: {
            CY: "WBTC",
            CY_TYPE: "ERC20"
        },
        SERO: {
            CY: "EWBTC",
            CY_TYPE: "SRC20"
        }

    },
    WETH :{
        ETH: {
            CY: "WETH",
            CY_TYPE: "ERC20"
        },
        SERO: {
            CY: "EWETH",
            CY_TYPE: "SRC20"
        }

    },
}

export const BRIDGE_RESOURCE_ID: any = {
    SERO: "0x0000000000000000000000fa083db782e41b5a93a9de81aaefc92d2708052800",
    USDT: "0x000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f400",
    WBTC: "0x000000000000000000000050395D1b70d8a73eF350AEbFE6278a212B018Ade01",
    WETH: "0x0000000000000000000000E69B7b16AD568BDF11924C0b471176553e9AD1aF01",
    TUSDT:"0x000000000000000000000040655D1b70d8a73eF350AEbFE6278a212B018Ade03"
}

export const EMIT_HOST: string = "http://127.0.0.1:7655/";

export const GAS_FEE_PROXY_ADDRESS:any = {
    EUSDT:"3zV9TNcWPKtLLhSksxX6bWKmYto3sz7j1xWWEDgEXheaVcHKX2qfm5A5Q69i4n15cQRjELmJbepFbPYEEjbxXvRz",
    EWBTC:"5oCMi6xww5MowNsKzZ7VHjmzyvUxAbjqifGaisQmMrgvZ7jEbY14PhjRbNt6EULHwMNwc7CbmAEjQ7JeM3DQDA4c",
    EWETH:"MhcfrgchQc8wZZoY2NGPsLUV4JNgR43WVriC2L4R5kc9eXumtZcRKA6AvG9goXLSr48hFn52BAr16nQ6yVJruXk",
    TUSDT:"4KVmCu9nkdhNYa3n4Yz4DVUHZyJmbGKqMB4gmRExhbQDibLLEWUkHaY25DJjLes2h9SVmPUk9E4gLzRmKzptFSSy",
}

export const TRON_API_HOST = {
    fullNode:"https://api.shasta.trongrid.io/",
    solidityNode:"https://api.shasta.trongrid.io",
    eventServer:"https://api.shasta.trongrid.io"
}