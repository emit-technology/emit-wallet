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
require("./CardTransform.scss");
var url_1 = require("../utils/url");
var types_1 = require("../types");
var sero_1 = require("../contract/epoch/sero");
var walletWorker_1 = require("../worker/walletWorker");
var utils = require("../utils");
var EpochAttribute_1 = require("./EpochAttribute");
var i18n_1 = require("../locales/i18n");
var copy_to_clipboard_1 = require("copy-to-clipboard");
var icons_1 = require("ionicons/icons");
var CardTransform = /** @class */ (function (_super) {
    __extends(CardTransform, _super);
    function CardTransform(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            deg: 0,
            showToast: false
        };
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, symbol, subTitle, account, device;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, symbol = _a.symbol, subTitle = _a.subTitle;
                        return [4 /*yield*/, walletWorker_1.default.accountInfo()];
                    case 1:
                        account = _b.sent();
                        if (!(symbol == "DEVICES")) return [3 /*break*/, 3];
                        return [4 /*yield*/, sero_1.default.axInfo(utils.getCategoryBySymbol(symbol, types_1.ChainType[types_1.ChainType.SERO]), subTitle, account.addresses[types_1.ChainType.SERO])];
                    case 2:
                        device = _b.sent();
                        this.setState({
                            device: device
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        this.setState({
                            device: undefined,
                        });
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.change = function () {
            var deg = _this.state.deg;
            if (deg == 0) {
                deg = 180;
            }
            else {
                deg = 0;
            }
            _this.setState({
                deg: deg
            });
            _this.init().catch(function (e) {
                console.log(e);
            });
            // const d:any = document.getElementsByClassName("card-display")[0];
            // console.log(d);
            // d.style.transform = "transform: rotateY(0deg);"
        };
        return _this;
    }
    CardTransform.prototype.componentDidMount = function () {
        this.init().catch();
        this.setState({
            deg: 0
        });
    };
    CardTransform.prototype.render = function () {
        var _this = this;
        var _a = this.state, deg = _a.deg, device = _a.device, showToast = _a.showToast;
        var _b = this.props, src = _b.src, title = _b.title, subTitle = _b.subTitle, chain = _b.chain, timestamp = _b.timestamp, description = _b.description, dna = _b.dna, symbol = _b.symbol;
        console.log(device, device === null || device === void 0 ? void 0 : device.ticket);
        return <>
            <div className="n-card">
                <div className="card-display" style={{ transform: "rotateY(" + deg + "deg)" }} onClick={function () {
            _this.change();
        }}>
                    <div className="card-front">
                        <img src={src}/>
                    </div>
                    <div className="card-back">
                        <img src={src}/>
                        <div className="card-back-f">
                            <react_1.IonGrid>
                                <react_1.IonRow className="row-line">
                                    <react_1.IonCol className="col-line">
                                        <h3>{title}</h3>
                                        <div onClick={function (e) {
            e.stopPropagation();
            copy_to_clipboard_1.default(subTitle);
            copy_to_clipboard_1.default(subTitle);
            _this.setState({
                showToast: true
            });
        }}><react_1.IonText>{subTitle}</react_1.IonText><div><react_1.IonIcon src={icons_1.copyOutline} size="small"/></div></div>
                                    </react_1.IonCol>
                                </react_1.IonRow>
                                <react_1.IonRow className="row-line">
                                    <react_1.IonCol className="col-line">
                                        <div className="font-sm">{i18n_1.default.t("chain")}</div>
                                        <div className="font-md">{chain}</div>
                                    </react_1.IonCol>
                                    <react_1.IonCol className="col-line">
                                        <div className="font-sm">{i18n_1.default.t("symbol")}</div>
                                        <div className="font-md">{utils.getCategoryBySymbol(symbol, chain + "")}</div>
                                    </react_1.IonCol>
                                    {device && utils.isDark(device.gene) &&
            <react_1.IonCol className="col-line">
                                            <div className="font-sm">DARK {i18n_1.default.t("rate")}</div>
                                            <div className="font-md">{utils.calcDark(device.gene)}</div>
                                        </react_1.IonCol>}
                                </react_1.IonRow>
                                <react_1.IonRow className="row-line" style={{ minHeight: "14vh" }}>
                                    <react_1.IonCol className="col-line">
                                        {device ?
            <EpochAttribute_1.default device={device} showDevice={true} showDriver={false}/>
            :
                description}
                                    </react_1.IonCol>
                                </react_1.IonRow>
                            </react_1.IonGrid>
                        </div>
                    </div>
                </div>
                <div className="card-foo">
                    <p><react_1.IonText>{title}</react_1.IonText></p>
                    <react_1.IonGrid>
                        <react_1.IonRow>
                                {utils.crossAbleBySymbol(symbol) &&
            <react_1.IonCol>
                                        <react_1.IonButton mode="ios" fill="outline" expand="block" size="small" onClick={function () {
                url_1.default.tunnelNFT(symbol, utils.getChainIdByName(chain), subTitle);
            }}>{i18n_1.default.t("cross")}</react_1.IonButton>
                                    </react_1.IonCol>}

                            <react_1.IonCol>
                                <react_1.IonButton mode="ios" fill="outline" expand="block" size="small" onClick={function () {
            url_1.default.transferNFT(symbol, utils.getChainIdByName(chain), subTitle);
        }}>{i18n_1.default.t("transfer")}</react_1.IonButton>
                            </react_1.IonCol>
                        </react_1.IonRow>
                    </react_1.IonGrid>
                </div>
            </div>
            <react_1.IonToast color="dark" position="top" isOpen={showToast} onDidDismiss={function () { return _this.setState({ showToast: false }); }} message="Copied to clipboard!" duration={1000} mode="ios"/>
        </>;
    };
    return CardTransform;
}(React.Component));
exports.default = CardTransform;
