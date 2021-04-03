"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPOCH_SETTLE_TIME = exports.FULL_NAME = exports.EXPLORER_URL = exports.NOT_CROSS_TOKEN = exports.META_TEMP = exports.TRON_API_HOST = exports.GAS_FEE_PROXY_ADDRESS = exports.EMIT_HOST = exports.BRIDGE_NFT_RESOURCE_ID = exports.BRIDGE_RESOURCE_ID = exports.BRIDGE_CURRENCY = exports.DISPLAY_NAME = exports.CHAIN_FEE = exports.DECIMAL_CURRENCY = exports.TOKEN_DESC = exports.GAS_PRICE_UNIT = exports.GAS_DEFAULT = exports.CHAIN_PARAMS_BSC = exports.CHAIN_PARAMS = exports.CONTRACT_ADDRESS = void 0;
exports.CONTRACT_ADDRESS = {
    ERC20: {
        ETH: {
            USDT: "0x793359af58fa92e0beb08f37e509071c42dcc32c",
            eSERO: "0xe462e7697F2fb33DE4eb46665D4E7D29DA647816",
            WBTC: "0x50395D1b70d8a73eF350AEbFE6278a212B018Ade",
            // WETH: "0xE69B7b16AD568BDF11924C0b471176553e9AD1aF"
            WETH: "0xCdf16E8188121F2A192C7Beaf3673B48F2DCE9fA",
            eLIGHT: "0x1A7D3DDd87eAF9d42b06A7AE34451cB5822aB705"
        },
        TRON: {
            USDT: "TCUnjCxPqwE2SB9vRo8oNwDZx9b7DxAkbv",
        },
        BSC: {
            bLIGHT: "0xBDCeCD245b571B2cAE35273D80951BF725eddFBC",
            bSERO: "0x8CAB1Fb646d4d70A08fbd5C019340f26aE7D293A"
        }
    },
    CROSS: {
        ETH: {
            BRIDGE: "0xC7c287200D0952d4f591509463fD5203C7D88F56",
            HANDLE: "0xB47E605e2daAfBD2A3F44216c47033FE71c96A2F",
            FEE: "0xff9a42F3eE1Ed8597dC26692809E53336ED4bC61",
        },
        TRON: {
            BRIDGE: "TAongUaLfhatu89hZAxgkinS57zfViBYMj",
            HANDLE: "TSg3up7xpeKTMSBs7PVwxrynuxQXJknqc4",
            FEE: "TP2qWxhgDhA6RkFgqMqYQjQLVePxBgLppC",
        },
        SERO: {
            BRIDGE: "5Pnnu6DNrgctaoNPRfKUww3KroYFFaeGLTZphJMGbP6EHtejuRcVT86jMwgBeWtiiDujnmrQpPhdzGhwzaWxj49b",
            HANDLE: "5Z2jSbr7jXBX31qKbNneaFD4NLkv6EwLqVnUsrw5KAQzdFJZHyndq9eZs3Su2LLVC1NsVpB545XDrFm1NoKwgHn8",
            FEE: "2s4Zz4xE9sMPZfMbxDCFhoaiJ6cdzbTwKhr9MYe5MPXoapjuR8mwigf3eLHzFQs7YJihwVypyJpp1VCwyKja6cVB",
        },
        BSC: {
            BRIDGE: "0x78f66f75b94dfD01704A04B997eE7b2A300b1B3b",
            HANDLE: "0x51895c689C181318D3E4A291044f71a29faB3a0a",
            FEE: "0x2609E70e49394Fa2dbEe7B27dfE92461326EafF5",
        }
    },
    CROSS_NFT: {
        ETH: {
            BRIDGE: "0xD9ec8487B3754010bEf3EDAf6c07C3F01Db45f85",
            HANDLE: "0x43119e81b75dE7D49f6b0acE68B02d35e82B3B72",
            FEE: "0xff9a42F3eE1Ed8597dC26692809E53336ED4bC61",
        },
        SERO: {
            BRIDGE: "3vvdsRXY38FudvE2kua3cWBoZFBzxJnfFWJByDCLc8h9LxKfXU6FneWLMr81cHC8aiYGQzanDh59dBy6z9zYzikC",
            HANDLE: "3ChPVQ7YTCk26Ubayx5zF4j8gdL6ia54WUua3ihfNF3LTStBrK6566dT92n1hWLuY37UszovZoSn6nga2WAB2qic",
            FEE: "2nJ4TeNnTBzJ2kubqDTa1nFNhiFeUomzsHMAp2r5ecgnbXmubWUQGz16us8raipvTNEXm7e4kAJUGbzoWTtwBn5w",
        }
    },
    ERC721: {
        MEDAL: {
            ADDRESS: {
                ETH: "0xd8C5e7797A973DBc55879de4430c3A2527876A0a",
                SERO: "2pzm54TnYuNhnVbX7R5hmiVtvwT3tUrzi1V98U8F2Gt8ndZ8nh9Wqu6ysPNn1hXmpaXzBcqjjyCsh6pHsN38UKmz"
            },
            SYMBOL: {
                ETH: "eMedal",
                SERO: "MEDALV3"
            },
            TYPE: "MEDAL",
            CROSS_ABLE: true
        },
        DEVICES: {
            ADDRESS: {
                SERO: "3Q26MKEJt7mB7HNkRpYVJVkDCtBpMLZAWob4QtDY13z3fBU3EKiucT8VNjAunsc8PmtmyJVL7wG1RpetKsSD8XoV"
            },
            SYMBOL: {
                SERO: "EMIT_AX"
            },
            TYPE: "DEVICES",
            CROSS_ABLE: false
        }
    },
    EPOCH: {
        SERO: {
            SERVICE: "4J2AVt7uEuRxxykoLj5RqxrfzcKtVTukWDUkZkHXeyaxEvbAhopa6eT8xyoRMCJqkuJpkHLPKqoqb1Ez1bDNiZsn"
        }
    }
};
exports.CHAIN_PARAMS = {
    baseChain: "mainnet",
    customer: {
        networkId: 15,
        chainId: 1337,
    },
    hardfork: "petersburg"
};
exports.CHAIN_PARAMS_BSC = {
    baseChain: "mainnet",
    customer: {
        networkId: 15,
        chainId: 1337,
    },
    hardfork: "petersburg"
};
exports.GAS_DEFAULT = {
    SERO: 25000,
    ETH: 21000,
    BSC: 21000
};
exports.GAS_PRICE_UNIT = {
    SERO: "GTa",
    ETH: "GWei",
    BSC: "GWei"
};
exports.TOKEN_DESC = {
    SERO: "Super ZERO",
    ETH: "Ethereum",
    USDT: "Ethereum USDT",
    WBTC: "Wrapped BTC",
    WETH: "Wrapped ETH",
    TUSDT: "TRON USDT",
    TRX: "TRON NETWORK",
    LIGHT: "ERC20",
    BNB: "Binance",
    bLIGHT: "BEP20",
    DARK: "SRC20"
};
exports.DECIMAL_CURRENCY = {
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
        TUSDT: 6,
        LIGHT: 18,
        DARK: 18
    },
    ETH: {
        SERO: 18,
        eSERO: 18,
        USDT: 6,
        ETH: 18,
        WBTC: 8,
        WETH: 18,
        eLIGHT: 18,
    },
    TRON: {
        TRX: 6,
        USDT: 6
    },
    BSC: {
        BNB: 18,
        bLIGHT: 18,
        bSERO: 18
    }
};
exports.CHAIN_FEE = {
    CHAIN: {
        GAS: 25000,
        GAS_PRICE: 1e9
    }
};
exports.DISPLAY_NAME = {
    TUSDT: "USDT",
    bLIGHT: "LIGHT"
};
exports.BRIDGE_CURRENCY = {
    ETH: {
        ETH: {
            CY: "ETH",
            CY_TYPE: ""
        },
    },
    BNB: {
        BSC: {
            CY: "BNB",
            CY_TYPE: ""
        }
    },
    SERO: {
        ETH: {
            CY: "eSERO",
            CY_TYPE: "ERC20",
            EXCEPT: ["BSC"],
            RESOURCE_ID: {
                SERO: "0x0000000000000000000000fa083db782e41b5a93a9de81aaefc92d2708052800"
            }
        },
        BSC: {
            CY: "bSERO",
            CY_TYPE: "BEP20",
            EXCEPT: ["ETH"],
            RESOURCE_ID: {
                SERO: "0x00000000000000000000000000000000000000000000000000005345524f0204"
            }
        },
        SERO: {
            CY: "SERO",
            CY_TYPE: "",
            RESOURCE_ID: {
                ETH: "0x0000000000000000000000fa083db782e41b5a93a9de81aaefc92d2708052800",
                BSC: "0x00000000000000000000000000000000000000000000000000005345524f0204"
            }
        }
    },
    TRX: {
        TRON: {
            CY: "TRX",
            CY_TYPE: ""
        }
    },
    LIGHT: {
        ETH: {
            CY: "eLIGHT",
            CY_TYPE: "ERC20",
            EXCEPT: ["BSC"],
            RESOURCE_ID: {
                SERO: "0x00000000000000000000000000000000000000000000000000004c4947485402"
            }
        },
        BSC: {
            CY: "bLIGHT",
            CY_TYPE: "BEP20",
            EXCEPT: ["ETH"],
            RESOURCE_ID: {
                SERO: "0x00000000000000000000000000000000000000000000000000004c4947480204"
            }
        },
        SERO: {
            CY: "LIGHT",
            CY_TYPE: "SRC20",
            RESOURCE_ID: {
                ETH: "0x00000000000000000000000000000000000000000000000000004c4947485402",
                BSC: "0x00000000000000000000000000000000000000000000000000004c4947480204"
            }
        }
    },
    DARK: {
        SERO: {
            CY: "DARK",
            CY_TYPE: "SRC20"
        }
    },
    WBTC: {
        ETH: {
            CY: "WBTC",
            CY_TYPE: "ERC20",
            RESOURCE_ID: {
                SERO: "0x000000000000000000000050395D1b70d8a73eF350AEbFE6278a212B018Ade01"
            }
        },
        SERO: {
            CY: "EWBTC",
            CY_TYPE: "SRC20",
            RESOURCE_ID: {
                ETH: "0x000000000000000000000050395D1b70d8a73eF350AEbFE6278a212B018Ade01"
            }
        }
    },
    WETH: {
        ETH: {
            CY: "WETH",
            CY_TYPE: "ERC20",
            RESOURCE_ID: {
                SERO: "0x0000000000000000000000E69B7b16AD568BDF11924C0b471176553e9AD1aF01"
            }
        },
        SERO: {
            CY: "EWETH",
            CY_TYPE: "SRC20",
            RESOURCE_ID: {
                ETH: "0x0000000000000000000000E69B7b16AD568BDF11924C0b471176553e9AD1aF01"
            }
        }
    },
    USDT: {
        ETH: {
            CY: "USDT",
            CY_TYPE: "ERC20",
            RESOURCE_ID: {
                SERO: "0x000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f400"
            }
        },
        SERO: {
            CY: "EUSDT",
            CY_TYPE: "SRC20",
            RESOURCE_ID: {
                ETH: "0x000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f400"
            }
        }
    },
    TUSDT: {
        TRON: {
            CY: "USDT",
            CY_TYPE: "TRC20",
            RESOURCE_ID: {
                SERO: "0x000000000000000000000040655D1b70d8a73eF350AEbFE6278a212B018Ade03"
            }
        },
        SERO: {
            CY: "TUSDT",
            CY_TYPE: "SRC20",
            RESOURCE_ID: {
                TRON: "0x000000000000000000000040655D1b70d8a73eF350AEbFE6278a212B018Ade03"
            }
        },
    }
};
exports.BRIDGE_RESOURCE_ID = {
    SERO: "0x0000000000000000000000fa083db782e41b5a93a9de81aaefc92d2708052800",
    USDT: "0x000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f400",
    WBTC: "0x000000000000000000000050395D1b70d8a73eF350AEbFE6278a212B018Ade01",
    WETH: "0x0000000000000000000000E69B7b16AD568BDF11924C0b471176553e9AD1aF01",
    TUSDT: "0x000000000000000000000040655D1b70d8a73eF350AEbFE6278a212B018Ade03",
    LIGHT: "0x00000000000000000000000000000000000000000000000000004c4947485402",
    bLIGHT: "0x00000000000000000000000000000000000000000000000000004c4947480204"
};
exports.BRIDGE_NFT_RESOURCE_ID = {
    MEDAL: "0x0000000000000000000000000000000000000000000000000000005465524f02",
};
// export const EMIT_HOST: string = "http://127.0.0.1:7655/";
exports.EMIT_HOST = "https://alpha-node.ririniannian.com/";
exports.GAS_FEE_PROXY_ADDRESS = {
    EUSDT: "3zV9TNcWPKtLLhSksxX6bWKmYto3sz7j1xWWEDgEXheaVcHKX2qfm5A5Q69i4n15cQRjELmJbepFbPYEEjbxXvRz",
    EWBTC: "5oCMi6xww5MowNsKzZ7VHjmzyvUxAbjqifGaisQmMrgvZ7jEbY14PhjRbNt6EULHwMNwc7CbmAEjQ7JeM3DQDA4c",
    EWETH: "MhcfrgchQc8wZZoY2NGPsLUV4JNgR43WVriC2L4R5kc9eXumtZcRKA6AvG9goXLSr48hFn52BAr16nQ6yVJruXk",
    TUSDT: "4KVmCu9nkdhNYa3n4Yz4DVUHZyJmbGKqMB4gmRExhbQDibLLEWUkHaY25DJjLes2h9SVmPUk9E4gLzRmKzptFSSy",
    LIGHT: "346key1zESqugEntMREC9RiyT87xYpDNytkQBxQY1zET7ESbtmNsSbnnxdKPsx82u2ND6ZdXsA3vtUNAXiLzQTwf",
};
exports.TRON_API_HOST = {
    fullNode: "https://api.shasta.trongrid.io/",
    solidityNode: "https://api.shasta.trongrid.io",
    eventServer: "https://api.shasta.trongrid.io"
};
exports.META_TEMP = {
    MEDAL: {
        name: "EMIT Builders Medal (01)",
        description: "First edition of the Builders Memorial Medal minted by EMIT Foundation (100 pieces in total)",
        image: "./assets/img/insignia.png",
        attributes: [{}]
    },
    DEVICES: {
        name: "EMIT AXE",
        description: "First edition of the Builders Memorial Medal minted by EMIT Foundation (100 pieces in total)",
        image: "./assets/img/axe.png",
        attributes: [{}]
    }
};
exports.NOT_CROSS_TOKEN = ["ETH", "TRX", "BNB", "DARK"];
exports.EXPLORER_URL = {
    BLOCK: {
        SERO: "https://explorer.sero.cash/blockInfo.html?hash=",
        ETH: {
            CN: "https://cn.etherscan.com/block/",
            EN: "https://etherscan.com/block/"
        },
        TRON: "https://tronscan.io/#/block/",
        BSC: "https://bscscan.com/block/"
    },
    TRANSACTION: {
        SERO: "https://explorer.sero.cash/txsInfo.html?hash=",
        ETH: {
            CN: "https://cn.etherscan.com/tx/",
            EN: "https://etherscan.com/tx/"
        },
        TRON: "https://tronscan.io/#/transaction/",
        BSC: "https://bscscan.com/tx/"
    }
};
exports.FULL_NAME = {
    ETH: "Ethereum Network",
    TRON: "Tron Network",
    SERO: "Super Zero",
    BSC: "Binance Smart Chain"
};
exports.EPOCH_SETTLE_TIME = 24 * 60 * 60;
