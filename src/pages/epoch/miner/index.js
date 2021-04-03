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
exports.MinerScenes = exports.MintState = void 0;
var mintWorker_1 = require("../../../worker/mintWorker");
var serojs = require('serojs');
var MintState;
(function (MintState) {
    MintState[MintState["_"] = 0] = "_";
    MintState[MintState["running"] = 1] = "running";
    MintState[MintState["stop"] = 2] = "stop";
})(MintState = exports.MintState || (exports.MintState = {}));
var MinerScenes;
(function (MinerScenes) {
    MinerScenes[MinerScenes["_"] = 0] = "_";
    MinerScenes[MinerScenes["altar"] = 1] = "altar";
    MinerScenes[MinerScenes["chaos"] = 2] = "chaos";
})(MinerScenes = exports.MinerScenes || (exports.MinerScenes = {}));
var Miner = /** @class */ (function () {
    function Miner(scenes) {
        var _this = this;
        this.setMiner = function (accountId) {
            _this.accountId = accountId;
        };
        this.isMining = function () { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miner.mintState(this.uKey())];
                    case 1:
                        rest = _a.sent();
                        if (rest && (rest.state == MintState.running && rest.timestamp && (Date.now() - rest.timestamp) < this.timeout)) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        }); };
        this.init = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miner.mintState(this.uKey())];
                    case 1:
                        rest = _a.sent();
                        if (!(rest && rest.state == MintState.running)) return [3 /*break*/, 4];
                        if (!(rest.timestamp && (Date.now() - rest.timestamp) > this.timeout)) return [3 /*break*/, 4];
                        rest.nonce = ""; // reset nonce
                        return [4 /*yield*/, this.miner.mintInit(rest)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.miner.mintStart()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(rest.phash != data.phash || rest.index != data.index || rest.address != data.address)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.miner.mintInit(data)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.miner.mintInit(rest)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.start = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var isMining;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // covert sero address by serojs getAddress;
                        // data.accountId = this.accountId;
                        data.scenes = this.scenes;
                        data.accountScenes = this.uKey();
                        return [4 /*yield*/, this.isMining()];
                    case 1:
                        isMining = _a.sent();
                        if (!!isMining) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.miner.mintInit(data)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.miner.mintStart()];
                    case 3:
                        _a.sent();
                        console.log("miner started!");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miner.mintStop(this.uKey())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.mintState = function () { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miner.mintState(this.uKey())];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        }); };
        this.uKey = function (k1, k2) {
            if (!k1 || !k2) {
                return [_this.accountId, _this.scenes].join("_");
            }
            return [k1, k2].join("_");
        };
        this.accountId = "";
        this.timeout = 30 * 1000;
        this.scenes = scenes;
        this.miner = new mintWorker_1.default(scenes);
    }
    return Miner;
}());
exports.default = Miner;
// import BigNumber from "bignumber.js";
// const BN = require("bn.js");
// const sha256 = require("sha256");
//
// const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));
//
// function genHashSeed(_phash:string,_addr:string,_index:string):string {
//     const buf1 = Buffer.from(_phash.slice(2),"hex");
//     const buf2 = Buffer.from(_addr.slice(2), 'hex')
//     const buf3 = new BN(_index.slice(2),"hex").toArrayLike(Buffer,"be",8)
//     const bufA = Buffer.concat([buf1, buf2, buf3])
//     return sha256(bufA);
// }
//
// // function genHash(_hashSeed:string,_nonce:number,_blocknum:number):string {
// //     return sha256(_nonce,_hashSeed,_blocknum);
// // }
//
// function genDigest(_hashSeed:string,_nonce:Buffer):any {
//     const buf1 = Buffer.from(_hashSeed,"hex");
//     const bufA = Buffer.concat([buf1, _nonce])
//     const a = sha256(bufA);
//     const te = new BN(a,"hex").toArrayLike(Buffer,"be",64)
//     // console.log("genDigest>>> ",a,new BN(te).toString(10));
//     return new BN(te);
// }
//
// function calcNE(_hashSeed:string,_nonce:Buffer):string {
//     const digest = genDigest(_hashSeed,_nonce);
//     const num = MAX_UINT256.div(digest);
//     const buf = num.toArrayLike(Buffer,'be',8)
//     return new BN(buf).toString(10)
// }
// // 0x755ade57f4ab18877cc9ec90826bdbef2b00d9c90b11141fce4438a032a2cdec
// // 0x55141036a5b8335d64e92183281c9ebc15a33fff61ece4d258fd5116b898ff8c
//
// function test(index:string,nonce:string){
//     const _phash = "0x6643536dbd7163921fef7f59c2c75e876d176f8bdc9a154536acf72e4d3c9d64";
//     const _address = "0xBc149B2e61C169394C8d7Fd9bF4912B3B8C1c8E1";
//     const _index = "0x"+new BigNumber(index);
//     const hashseed = genHashSeed(_phash,_address,_index)
//     // console.log("hashseed:::",hashseed)
//     const buf = new BN(nonce.slice(2),"hex").toArrayLike(Buffer,"be",8);
//     const ne:any = calcNE(hashseed,buf);
//     // console.log("calcNE>>>> ",index,nonce,ne)
//     return ne;
// }
//
// let index = "0x1";
// let max = 0 ;
// let begin = Date.now();
// // let i = random(0,2**64) ;
// function run(){
//     let i = Math.floor(Math.random()*10**16)
//     // console.log("nonce>>",new BigNumber(i).toString(10))
//     const rest:any = test(index,"0x"+new BigNumber(i).toString(16))
//     if(new BigNumber(max).comparedTo(new BigNumber(rest)) == -1){
//         max = rest;
//         console.log(`index=[${index}], nonce=[${new BigNumber(i).toString(10)}], ne=[${max}], cost=[${(Date.now()-begin)/1000}]s`)
//         begin = Date.now();
//     }
//     start()
// }
//
// function random(min:number, max:number) {
//     return Math.floor(Math.random() * (max - min)) + min;
// }
//
// export function start(){
//     run()
// }
//
// // start()
//
