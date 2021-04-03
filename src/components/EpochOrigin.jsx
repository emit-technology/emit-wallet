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
var React = require("react");
var react_1 = require("@ionic/react");
var ConfirmTransaction_1 = require("./ConfirmTransaction");
var sero_1 = require("../contract/epoch/sero");
var miner_1 = require("../pages/epoch/miner");
var types_1 = require("../types");
var bignumber_js_1 = require("bignumber.js");
var utils = require("../utils");
var rpc_1 = require("../rpc");
var react_countdown_1 = require("react-countdown");
var icons_1 = require("ionicons/icons");
var core_1 = require("@capacitor/core");
var url_1 = require("../utils/url");
var walletWorker_1 = require("../worker/walletWorker");
var altar_1 = require("../pages/epoch/miner/altar");
var chaos_1 = require("../pages/epoch/miner/chaos");
var interval_1 = require("../interval");
require("./EpochOrigin.scss");
var config_1 = require("../config");
var EpochAttribute_1 = require("./EpochAttribute");
var i18n_1 = require("../locales/i18n");
var Currency = "LIGHT";
var Category = "EMIT_AX";
var EpochOrigin = /** @class */ (function (_super) {
    __extends(EpochOrigin, _super);
    function EpochOrigin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            amount: "0",
            showAlert: false,
            tx: {},
            showToast: false,
            selectAxe: "",
            checked: false,
            showLoading: false,
            isMining: false,
            mintData: { ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: "" },
            showModal: false,
            tkt: [],
            periods: [],
            nexPeriods: [],
            myPeriods: []
        };
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var scenes, account, fromAddress, userInfo, device, period, myPeriod, periods, nexPeriods, myPeriods, _a, _b, tkt, isMining, items, _i, items_1, item, items, _c, items_2, item;
            var _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        scenes = this.props.scenes;
                        return [4 /*yield*/, walletWorker_1.default.accountInfo()];
                    case 1:
                        account = _e.sent();
                        this.miner().setMiner(account.accountId ? account.accountId : "");
                        fromAddress = account.addresses[types_1.ChainType.SERO];
                        return [4 /*yield*/, sero_1.default.userInfo(scenes, fromAddress)];
                    case 2:
                        userInfo = _e.sent();
                        return [4 /*yield*/, sero_1.default.lockedDevice(scenes, fromAddress)];
                    case 3:
                        device = _e.sent();
                        period = new bignumber_js_1.default(userInfo.currentPeriod).toNumber();
                        myPeriod = new bignumber_js_1.default(userInfo.settlementPeriod).toNumber();
                        return [4 /*yield*/, sero_1.default.userPeriodInfo(scenes, period, fromAddress)];
                    case 4:
                        periods = _e.sent();
                        return [4 /*yield*/, sero_1.default.userPeriodInfo(scenes, period + 1, fromAddress)];
                    case 5:
                        nexPeriods = _e.sent();
                        myPeriods = [];
                        if (!(myPeriod > 0 && myPeriod != period)) return [3 /*break*/, 7];
                        return [4 /*yield*/, sero_1.default.userPeriodInfo(scenes, new bignumber_js_1.default(userInfo.settlementPeriod).toNumber(), fromAddress)];
                    case 6:
                        myPeriods = _e.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        myPeriods = periods;
                        _e.label = 8;
                    case 8:
                        if (!(account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial)) return [3 /*break*/, 11];
                        _b = (_a = this.miner()).init;
                        _d = {
                            phash: userInfo.pImage.hash
                        };
                        return [4 /*yield*/, utils.getShortAddress(fromAddress)];
                    case 9: return [4 /*yield*/, _b.apply(_a, [(_d.address = _e.sent(),
                                _d.index = utils.toHex(userInfo.pImage.serial),
                                _d.scenes = scenes,
                                _d.accountScenes = this.miner().uKey(),
                                _d.accountId = account.accountId,
                                _d)])];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11: return [4 /*yield*/, this.mintState()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, this.getTicket(fromAddress)];
                    case 13:
                        tkt = _e.sent();
                        return [4 /*yield*/, this.miner().isMining()];
                    case 14:
                        isMining = _e.sent();
                        this.setState({
                            isMining: isMining,
                            userInfo: userInfo,
                            device: device,
                            account: account,
                            tkt: tkt,
                            periods: periods,
                            nexPeriods: nexPeriods,
                            myPeriods: myPeriods
                        });
                        if (device && device.category) {
                            items = document.getElementsByClassName("display-n");
                            for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                                item = items_1[_i];
                                item.style.display = "inherit";
                            }
                        }
                        else {
                            items = document.getElementsByClassName("display-n");
                            for (_c = 0, items_2 = items; _c < items_2.length; _c++) {
                                item = items_2[_c];
                                item.style.display = "none";
                            }
                        }
                        if (isMining) {
                            interval_1.default.start(function () {
                                _this.mintState().then(function () {
                                }).catch(function (e) {
                                    console.error(e);
                                });
                            }, 1 * 1000);
                        }
                        else {
                            interval_1.default.stop();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.miner = function () {
            return _this.props.scenes == miner_1.MinerScenes.altar ? altar_1.default : chaos_1.default;
        };
        _this.done = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setShowLoading(true);
                        return [4 /*yield*/, sero_1.default.done(this.props.scenes)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.do(data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.prepare = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, mintData, amount, minNE, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, mintData = _a.mintData, amount = _a.amount;
                        this.setShowLoading(true);
                        if (!mintData.nonceDes) return [3 /*break*/, 5];
                        return [4 /*yield*/, sero_1.default.minPowNE()];
                    case 1:
                        minNE = _b.sent();
                        if (!(new bignumber_js_1.default(mintData && mintData.ne ? mintData.ne : 0).comparedTo(new bignumber_js_1.default(minNE)) == 1 || new bignumber_js_1.default(amount).toNumber() > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, sero_1.default.prepare(this.props.scenes, mintData.nonceDes)];
                    case 2:
                        data = _b.sent();
                        return [4 /*yield*/, this.do(data)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, Promise.reject(i18n_1.default.t("minNE") + " " + minNE)];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        _this.do = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, account, mintData, device, amount, selectAxe, checked, tx, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.state, account = _a.account, mintData = _a.mintData, device = _a.device, amount = _a.amount, selectAxe = _a.selectAxe, checked = _a.checked;
                        if (mintData.scenes == miner_1.MinerScenes.chaos && !selectAxe && !checked && !(device === null || device === void 0 ? void 0 : device.category)) {
                            return [2 /*return*/, Promise.reject(i18n_1.default.t("pleaseSelectAxe"))];
                        }
                        if (!account) return [3 /*break*/, 4];
                        tx = {
                            from: account.addresses && account.addresses[types_1.ChainType.SERO],
                            to: sero_1.default.address,
                            cy: Currency,
                            gasPrice: "0x" + new bignumber_js_1.default(1).multipliedBy(1e9).toString(16),
                            chain: types_1.ChainType.SERO,
                            amount: "0x0",
                            feeCy: Currency,
                            value: utils.toHex(amount, 18),
                            data: data,
                        };
                        if (!checked && selectAxe) {
                            tx.catg = Category;
                            tx.tkt = selectAxe;
                            tx.tickets = [{
                                    Category: Category,
                                    Value: selectAxe
                                }];
                        }
                        if (checked) {
                            tx.value = "0x0";
                        }
                        _b = tx;
                        return [4 /*yield*/, sero_1.default.estimateGas(tx)];
                    case 1:
                        _b.gas = _d.sent();
                        if (!(tx.gas && tx.gasPrice)) return [3 /*break*/, 3];
                        _c = tx;
                        return [4 /*yield*/, sero_1.default.tokenRate(tx.gasPrice, tx.gas)];
                    case 2:
                        _c.feeValue = _d.sent();
                        _d.label = 3;
                    case 3:
                        this.setState({
                            tx: tx,
                            showAlert: true
                        });
                        this.setShowLoading(false);
                        this.setShowModal(false);
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.setShowAlert = function (f) {
            _this.setState({
                showAlert: f
            });
        };
        _this.confirm = function (hash) { return __awaiter(_this, void 0, void 0, function () {
            var intervalId, chain;
            var _this = this;
            return __generator(this, function (_a) {
                intervalId = 0;
                chain = types_1.ChainType.SERO;
                this.setShowLoading(true);
                intervalId = setInterval(function () {
                    rpc_1.default.getTxInfo(chain, hash).then(function (rest) {
                        if (rest && rest.num > 0) {
                            // this.setShowToast(true,"success","Commit Successfully!")
                            clearInterval(intervalId);
                            // url.transactionInfo(chain,hash,Currency);
                            _this.setShowLoading(false);
                            _this.init();
                        }
                    }).catch(function (e) {
                        console.error(e);
                    });
                }, 3000);
                this.setShowAlert(false);
                this.setState({
                    amount: "0",
                    tx: {},
                    selectAxe: "",
                    periods: [],
                    nexPeriods: [],
                    myPeriods: [],
                    checked: false
                });
                return [2 /*return*/];
            });
        }); };
        _this.setShowToast = function (f, color, m) {
            _this.setState({
                showToast: f,
                toastMessage: m,
                color: color
            });
        };
        _this.setShowLoading = function (f) {
            _this.setState({
                showLoading: f
            });
        };
        _this.setOperate = function (v) {
            _this.setState({
                checked: v == "stop"
            });
        };
        // @ts-ignore
        _this.renderer = function (_a) {
            var hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds, completed = _a.completed;
            if (completed) {
                return <span></span>;
            }
            var h = hours, m = minutes, s = seconds;
            if (new bignumber_js_1.default(hours).toNumber() <= 9) {
                h = "0" + hours;
            }
            if (new bignumber_js_1.default(minutes).toNumber() <= 9) {
                m = "0" + minutes;
            }
            if (new bignumber_js_1.default(seconds).toNumber() <= 9) {
                s = "0" + seconds;
            }
            return <div className="countdown">{h}:{m}:{s}</div>;
        };
        _this.getTicket = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rpc_1.default.getTicket(types_1.ChainType.SERO, address)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest ? rest["EMIT_AX"] : []];
                }
            });
        }); };
        _this.operate = function () { return __awaiter(_this, void 0, void 0, function () {
            var isMining;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isMining = this.state.isMining;
                        if (!isMining) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stop()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.start()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.init().catch()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.start = function () { return __awaiter(_this, void 0, void 0, function () {
            var scenes, _a, account, userInfo, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        scenes = this.props.scenes;
                        _a = this.state, account = _a.account, userInfo = _a.userInfo;
                        if (!(account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial)) return [3 /*break*/, 3];
                        _c = (_b = this.miner()).start;
                        _d = {
                            phash: userInfo.pImage.hash
                        };
                        return [4 /*yield*/, utils.getShortAddress(account.addresses[types_1.ChainType.SERO])];
                    case 1: return [4 /*yield*/, _c.apply(_b, [(_d.address = _e.sent(),
                                _d.index = utils.toHex(userInfo.pImage.serial),
                                _d.scenes = scenes,
                                _d.accountScenes = this.miner().uKey(),
                                _d.accountId = account.accountId,
                                _d)])];
                    case 2:
                        _e.sent();
                        this.setState({
                            isMining: true
                        });
                        _e.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.miner().stop()];
                    case 1:
                        _a.sent();
                        this.setState({
                            isMining: false
                        });
                        this.setShowModal(true);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.setShowModal = function (f) {
            _this.setState({
                showModal: f
            });
        };
        _this.renderStatic = function (periods, b, text, period) {
            var scenes = _this.props.scenes;
            var userInfo = _this.state.userInfo;
            var t = <react_1.IonText>{text} <span className="font-weight-800 font-ep">{period}</span></react_1.IonText>;
            var nextPeriodTime = (userInfo && new bignumber_js_1.default(userInfo.lastUpdateTime).toNumber() > 0
                ? new bignumber_js_1.default(userInfo.lastUpdateTime).toNumber() + config_1.EPOCH_SETTLE_TIME : 0) * 1000;
            return <>
            {scenes == miner_1.MinerScenes.altar && periods.length == 2 ?
                <div className="ctx">
                        <react_1.IonItemDivider mode="md"><react_1.IonText color="dark">{t}</react_1.IonText> {b &&
                    <react_countdown_1.default date={nextPeriodTime} renderer={_this.renderer}/>}</react_1.IonItemDivider>
                        <react_1.IonRow>
                            <react_1.IonCol size="3"></react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("my")}</react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("total")}</react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("pool")}</react_1.IonCol>
                        </react_1.IonRow>
                        <react_1.IonRow>
                            <react_1.IonCol size="3">HR({new bignumber_js_1.default(periods[0].pool).multipliedBy(100).dividedBy(new bignumber_js_1.default(periods[0].pool).plus(new bignumber_js_1.default(periods[1].pool))).toFixed(0)}%)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(periods[0].ne, 2)}(NE)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(periods[0].total, 2)}(NE)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(new bignumber_js_1.default(periods[0].total).toNumber() > 0 ? utils.fromValue(new bignumber_js_1.default(periods[0].pool).multipliedBy(new bignumber_js_1.default(periods[0].ne))
                    .dividedBy(new bignumber_js_1.default(periods[0].total)), 18) : 0, 2)}(EN)</react_1.IonCol>
                        </react_1.IonRow>
                        <react_1.IonRow>
                            <react_1.IonCol size="3">BL({new bignumber_js_1.default(periods[1].pool).multipliedBy(100).dividedBy(new bignumber_js_1.default(periods[0].pool).plus(new bignumber_js_1.default(periods[1].pool))).toFixed(0)}%)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(utils.fromValue(periods[1].ne, 18), 2)}(L)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(utils.fromValue(periods[1].total, 18), 2)}(L)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(new bignumber_js_1.default(periods[1].total).toNumber() > 0 ? utils.fromValue(new bignumber_js_1.default(periods[1].pool).multipliedBy(new bignumber_js_1.default(periods[1].ne))
                    .dividedBy(new bignumber_js_1.default(periods[1].total)), 18).toFixed(0, 1) : 0, 2)}(EN)</react_1.IonCol>
                        </react_1.IonRow>
                    </div>
                :
                    scenes == miner_1.MinerScenes.chaos && periods.length == 1 &&
                        <div className="ctx">
                        <react_1.IonItemDivider mode="md"><react_1.IonText color="dark">{t}</react_1.IonText> {b &&
                            <react_countdown_1.default date={nextPeriodTime} renderer={_this.renderer}/>}</react_1.IonItemDivider>
                        <react_1.IonRow>
                            <react_1.IonCol size="3"></react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("my")}</react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("total")}</react_1.IonCol>
                            <react_1.IonCol size="3">{i18n_1.default.t("pool")}</react_1.IonCol>
                        </react_1.IonRow>
                        <react_1.IonRow>
                            <react_1.IonCol size="3">HR</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(periods[0].ne, 2)}(NE)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(periods[0].total, 2)}(NE)</react_1.IonCol>
                            <react_1.IonCol size="3">{utils.nFormatter(new bignumber_js_1.default(periods[0].total).toNumber() > 0 ? utils.fromValue(new bignumber_js_1.default(periods[0].pool).multipliedBy(new bignumber_js_1.default(periods[0].ne))
                            .dividedBy(new bignumber_js_1.default(periods[0].total)), 18).toFixed(0, 1) : 0, 2)}(L)
                            </react_1.IonCol>
                        </react_1.IonRow>
                    </div>}
        </>;
        };
        _this.onSelectDevice = function (ticket) { return __awaiter(_this, void 0, void 0, function () {
            var account, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ticket) return [3 /*break*/, 2];
                        account = this.state.account;
                        return [4 /*yield*/, sero_1.default.axInfo(Category, ticket, account && account.addresses[types_1.ChainType.SERO])];
                    case 1:
                        rest = _a.sent();
                        this.setState({
                            selectDevice: rest,
                            selectAxe: ticket
                        });
                        return [2 /*return*/];
                    case 2:
                        this.setState({
                            selectAxe: ticket
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    EpochOrigin.prototype.componentDidMount = function () {
        core_1.Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(function (e) {
        });
        this.init().then(function () {
        }).catch(function (e) {
            console.error(e);
        });
    };
    EpochOrigin.prototype.mintState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rest, _a, mintData, isMining;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.miner().mintState()];
                    case 1:
                        rest = _b.sent();
                        _a = this.state, mintData = _a.mintData, isMining = _a.isMining;
                        if (isMining || rest.nonce != mintData.nonce || rest.ne != mintData.ne) {
                            this.setState({
                                mintData: rest
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EpochOrigin.prototype.render = function () {
        var _this = this;
        var scenes = this.props.scenes;
        // const {showModal, mintData, device, userInfo, setShowModal, tkt,periods} = this.props;
        var _a = this.state, periods = _a.periods, showAlert = _a.showAlert, tx = _a.tx, toastMessage = _a.toastMessage, showLoading = _a.showLoading, color = _a.color, showToast = _a.showToast, selectAxe = _a.selectAxe, checked = _a.checked, amount = _a.amount, isMining = _a.isMining, mintData = _a.mintData, device = _a.device, userInfo = _a.userInfo, showModal = _a.showModal, tkt = _a.tkt, nexPeriods = _a.nexPeriods, selectDevice = _a.selectDevice, myPeriods = _a.myPeriods;
        var period = new bignumber_js_1.default(userInfo ? userInfo.currentPeriod : 0).toNumber();
        var myPeriod = new bignumber_js_1.default(userInfo ? userInfo.settlementPeriod : 0).toNumber();
        return <react_1.IonPage>
            <react_1.IonContent fullscreen color="light">

                <div className="content-ion">
                    <react_1.IonItem className="heard-bg" color="primary" lines="none">
                        <react_1.IonIcon src={icons_1.chevronBack} style={{ color: "#edcc67" }} slot="start" onClick={function () {
            core_1.Plugins.StatusBar.setBackgroundColor({
                color: "#194381"
            }).catch(function (e) {
            });
            url_1.default.back();
        }}/>
                        <react_1.IonLabel className="text-center text-bold" style={{
            color: "#edcc67",
            textTransform: "uppercase"
        }}>{miner_1.MinerScenes[this.props.scenes]}</react_1.IonLabel>
                        <img src={"./assets/img/epoch/help.png"} width={28} onClick={function () {
            var help_url = scenes == miner_1.MinerScenes.altar ?
                "https://docs.emit.technology/emit-documents/emit-epoch/origin-universe/altar-scenes" :
                "https://docs.emit.technology/emit-documents/emit-epoch/origin-universe/chaos-scenes";
            core_1.Plugins.Browser.open({ url: help_url, presentationStyle: "popover" }).catch(function (e) {
                console.error(e);
            });
        }}/>
                    </react_1.IonItem>

                    <div style={{ padding: "0 10vw", minHeight: "125px" }}>
                        <EpochAttribute_1.default device={device} driver={userInfo && userInfo.driver} showDevice={true} showDriver={true}/>
                    </div>
                    <div onClick={function () {
            _this.setShowModal(true);
            _this.init().catch();
        }}>
                        {this.props.children}
                    </div>
                    <div>
                        {mintData && mintData.ne &&
            <div className="ne-text">
                            {mintData && mintData.ne}<span style={{ letterSpacing: "2px", color: "#f0f" }}>NE</span>
                        </div>}
                        {mintData && mintData.nonce && <div className="nonce-text">
                            <span className="nonce-span">{mintData && mintData.nonce}</span>
                        </div>}
                        <div className="start-btn" style={{ background: !!isMining ? "red" : "green" }} onClick={function () {
            _this.operate().then(function () {
            }).catch(function (e) {
                console.error(e);
            });
        }}>
                            <div style={{ margin: "10.5vw 0" }} className="font-ep">
                                {!!isMining ? new bignumber_js_1.default(mintData.hashrate ? mintData.hashrate.o : 0).toFixed(0) + "/s" : "HashRate"}
                            </div>
                        </div>
                    </div>
                </div>


                <react_1.IonModal isOpen={showModal} cssClass='epoch-modal' swipeToClose={true} onDidDismiss={function () { return _this.setShowModal(false); }}>
                    <div className="epoch-md">
                        <div>
                            <div className="modal-header">{scenes == miner_1.MinerScenes.altar ? i18n_1.default.t("forging") : i18n_1.default.t("mining")}</div>
                            
                            
                            
                            
                        </div>
                        <react_1.IonList>
                            {device && device.category &&
            <div style={{ padding: "12px" }}>
                                    <react_1.IonRow>
                                        <react_1.IonCol size="1"></react_1.IonCol>
                                        <react_1.IonCol>
                                            <react_1.IonSegment mode="ios" onIonChange={function (e) { return _this.setOperate(e.detail.value); }} value={checked ? "stop" : "refining"}>
                                                <react_1.IonSegmentButton value="refining">
                                                    <react_1.IonLabel>{i18n_1.default.t("prepare")}</react_1.IonLabel>
                                                </react_1.IonSegmentButton>
                                                <react_1.IonSegmentButton value="stop">
                                                    <react_1.IonLabel>{i18n_1.default.t("retrieve")}</react_1.IonLabel>
                                                </react_1.IonSegmentButton>
                                            </react_1.IonSegment>
                                        </react_1.IonCol>
                                        <react_1.IonCol size="1"></react_1.IonCol>
                                    </react_1.IonRow>
                                </div>}
                            {((device && device.category || tkt && tkt.length > 0) && !checked) &&
            <>
                                    <react_1.IonItem>
                                        <react_1.IonLabel><span className="font-md">{i18n_1.default.t("changeAxe")}</span></react_1.IonLabel>
                                        <react_1.IonSelect mode="ios" value={selectAxe} onIonChange={function (e) {
                _this.onSelectDevice(e.detail.value).catch(function (e) {
                    console.error(e);
                });
            }}>
                                            {miner_1.MinerScenes.altar == mintData.scenes &&
                <react_1.IonSelectOption value={""}>{device && device.category ? i18n_1.default.t("notChange") : i18n_1.default.t("newAxe")}</react_1.IonSelectOption>}
                                            {miner_1.MinerScenes.chaos == mintData.scenes && device && device.category &&
                <react_1.IonSelectOption value={""}>{i18n_1.default.t("notChange")}</react_1.IonSelectOption>}
                                            {tkt && tkt.map(function (value) {
                return <react_1.IonSelectOption value={value.tokenId}>{value.tokenId}</react_1.IonSelectOption>;
            })}
                                        </react_1.IonSelect>
                                    </react_1.IonItem>
                                </>}
                            {selectAxe &&
            <div style={{ padding: "0 12px" }}>
                                    <EpochAttribute_1.default device={selectDevice} showDevice={true} showDriver={false}/>
                                </div>}
                            {!checked && <react_1.IonItem>
                                    <react_1.IonLabel><span className="font-md">HashRate(HR)</span></react_1.IonLabel>
                                    <react_1.IonChip color="tertiary" className="font-weight-800 font-ep">{mintData && mintData.ne} NE</react_1.IonChip>
                                </react_1.IonItem>}
                            {mintData.scenes == miner_1.MinerScenes.altar && !checked && <react_1.IonItem>
                                    <react_1.IonLabel position="stacked">Burn LIGHT(BL)</react_1.IonLabel>
                                    <react_1.IonInput mode="ios" placeholder="0" value={amount} onIonChange={function (v) {
            _this.setState({
                amount: v.detail.value
            });
        }}/>
                                </react_1.IonItem>}
                        </react_1.IonList>
                        <div className="epoch-desc">
                            {this.renderStatic(nexPeriods, true, i18n_1.default.t("currentPeriod"), period + 1)}
                            {this.renderStatic(periods, false, i18n_1.default.t("lastPeriod"), period)}
                            {this.renderStatic(myPeriods, false, i18n_1.default.t("myLastPeriod"), myPeriod)}
                        </div>
                        <div className="btn-bottom">
                            <react_1.IonRow>
                                <react_1.IonCol size="4">
                                    <react_1.IonButton expand="block" mode="ios" fill={"outline"} color="primary" onClick={function () {
            _this.setShowModal(false);
        }}>{i18n_1.default.t("cancel")}</react_1.IonButton>
                                </react_1.IonCol>
                                <react_1.IonCol size="8">
                                    <react_1.IonButton expand="block" mode="ios" color="primary" disabled={checked && userInfo && new bignumber_js_1.default(userInfo.currentPeriod).toNumber() < new bignumber_js_1.default(userInfo.settlementPeriod).toNumber() ||
            !checked && new bignumber_js_1.default(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && mintData.scenes == miner_1.MinerScenes.chaos ||
            new bignumber_js_1.default(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && new bignumber_js_1.default(amount).toNumber() == 0 && mintData.scenes == miner_1.MinerScenes.altar && !checked} onClick={function () {
            if (checked) {
                _this.done().then(function () {
                }).catch(function (e) {
                    _this.setShowLoading(false);
                    var err = typeof e == "string" ? e : e.message;
                    _this.setShowToast(true, "warning", err);
                });
            }
            else {
                _this.prepare().then(function () {
                }).catch(function (e) {
                    _this.setShowLoading(false);
                    var err = typeof e == "string" ? e : e.message;
                    _this.setShowToast(true, "warning", err);
                });
            }
        }}>
                                        {checked && userInfo && new bignumber_js_1.default(userInfo.currentPeriod).toNumber() < new bignumber_js_1.default(userInfo.settlementPeriod).toNumber() ? "Your Period is in progress" :
            !checked && new bignumber_js_1.default(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && mintData.scenes == miner_1.MinerScenes.chaos ? "HashRate is 0" :
                new bignumber_js_1.default(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && new bignumber_js_1.default(amount).toNumber() == 0 && mintData.scenes == miner_1.MinerScenes.altar && !checked ? "HR or BL is 0" : i18n_1.default.t("commit")}
                                        
                                        
                                        
                                        
                                        
                                    </react_1.IonButton>
                                </react_1.IonCol>
                            </react_1.IonRow>
                        </div>
                    </div>
                </react_1.IonModal>

                <react_1.IonToast color={!color ? "warning" : color} position="top" isOpen={showToast} onDidDismiss={function () { return _this.setShowToast(false); }} message={toastMessage} duration={1500} mode="ios"/>


                <react_1.IonLoading mode="ios" spinner={"bubbles"} cssClass='my-custom-class' isOpen={showLoading} onDidDismiss={function () { return _this.setShowLoading(false); }} message={'Please wait...'} duration={120000}/>

                <ConfirmTransaction_1.default show={showAlert} transaction={tx} onProcess={function (f) {
        }} onCancel={function () { return _this.setShowAlert(false); }} onOK={this.confirm}/>

            </react_1.IonContent>
        </react_1.IonPage>;
    };
    return EpochOrigin;
}(React.Component));
exports.default = EpochOrigin;
