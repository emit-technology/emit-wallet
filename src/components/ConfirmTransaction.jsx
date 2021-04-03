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
var React = require("react");
var types_1 = require("../types");
var react_1 = require("@ionic/react");
var rpc_1 = require("../rpc");
var utils = require("../utils");
var bignumber_js_1 = require("bignumber.js");
var i18n_1 = require("../locales/i18n");
require("./gasPrice.css");
var ConfirmTransaction = /** @class */ (function (_super) {
    __extends(ConfirmTransaction, _super);
    function ConfirmTransaction(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showActionSheet: false,
            // showPasswordAlert:false,
            showToast: false,
            toastColor: "warning",
            toastMsg: "",
            showLoading: false,
            accountResource: {}
        };
        _this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var tx, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!this.props.show) return [3 /*break*/, 12];
                        tx = this.props.transaction;
                        if (!(tx.chain == types_1.ChainType.ETH || tx.chain == types_1.ChainType.BSC)) return [3 /*break*/, 5];
                        if (!!tx.gas) return [3 /*break*/, 4];
                        _a = tx;
                        if (!tx.data) return [3 /*break*/, 2];
                        return [4 /*yield*/, rpc_1.default.post("eth_estimateGas", [tx], tx.chain)];
                    case 1:
                        _b = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = utils.defaultGas(types_1.ChainType.ETH);
                        _e.label = 3;
                    case 3:
                        _a.gas = _b;
                        _e.label = 4;
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        if (!(tx.chain == types_1.ChainType.SERO)) return [3 /*break*/, 10];
                        if (!!tx.gas) return [3 /*break*/, 9];
                        _c = tx;
                        if (!tx.data) return [3 /*break*/, 7];
                        return [4 /*yield*/, rpc_1.default.post("sero_estimateGas", [tx], tx.chain)];
                    case 6:
                        _d = _e.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _d = utils.defaultGas(types_1.ChainType.SERO);
                        _e.label = 8;
                    case 8:
                        _c.gas = _d;
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (tx.chain == types_1.ChainType.TRON) {
                        }
                        _e.label = 11;
                    case 11:
                        this.setState({
                            transaction: tx,
                            showActionSheet: true
                        });
                        _e.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        _this.confirm = function (password) { return __awaiter(_this, void 0, void 0, function () {
            var transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = this.state.transaction;
                        // if(!password){
                        //     return Promise.reject("Please Input Password!");
                        // }
                        this.props.onProcess(true);
                        this.setState({
                            showLoading: true
                        });
                        if (!transaction) return [3 /*break*/, 2];
                        return [4 /*yield*/, rpc_1.default.commitTx(transaction, password)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, ""];
                }
            });
        }); };
        _this.setShowPasswordAlert = function (f) {
            // this.setState({
            // showPasswordAlert:f
            // })
            _this.confirm("").then(function (hash) {
                _this.setShowActionShell(false);
                _this.setShowLoading(true);
                _this.props.onOK && _this.props.onOK(hash);
            }).catch(function (e) {
                _this.props.onCancel();
                _this.props.onProcess(false);
                _this.setShowLoading(false);
                var err = typeof e === "string" ? e : e.message;
                _this.setShowToast(true, "danger", err);
            });
        };
        _this.setShowToast = function (f, color, err) {
            _this.setState({
                showToast: f,
                toastMsg: err,
                toastColor: color
            });
        };
        _this.fee = function () {
            var transaction = _this.state.transaction;
            if (transaction) {
                var feeCy = transaction.feeCy;
                if (transaction.feeValue) {
                    return utils.fromValue(transaction.feeValue, utils.getCyDecimal(feeCy, types_1.ChainType[transaction.chain])).toString(10);
                }
                else {
                    if (transaction.gasPrice && transaction.gas) {
                        return utils.fromValue(new bignumber_js_1.default(transaction.gasPrice).multipliedBy(new bignumber_js_1.default(transaction.gas)), utils.getCyDecimal(feeCy, types_1.ChainType[transaction.chain])).toString(10);
                    }
                }
            }
            return "0.00";
        };
        _this.setShowActionShell = function (f) {
            _this.setState({
                showActionSheet: f
            });
            if (!f) {
                _this.props.onCancel();
            }
        };
        _this.setShowLoading = function (f) {
            _this.setState({
                showLoading: f
            });
        };
        return _this;
    }
    ConfirmTransaction.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        var _this = this;
        if (prevProps.show !== this.props.show && this.props.show) {
            this.init().catch(function (e) {
                _this.props.onCancel();
                console.error(e);
            });
        }
    };
    ConfirmTransaction.prototype.render = function () {
        var _this = this;
        var _a = this.state, transaction = _a.transaction, showLoading = _a.showLoading, showActionSheet = _a.showActionSheet, showToast = _a.showToast, toastMsg = _a.toastMsg, toastColor = _a.toastColor, accountResource = _a.accountResource;
        var value = utils.fromValue(transaction && transaction.value, 0).toNumber() == 0 ?
            transaction && transaction.amount : transaction && transaction.value;
        return <>
            <react_1.IonModal isOpen={showActionSheet} cssClass="confirm-transaction-modal" onDidDismiss={function () { return _this.setShowActionShell(false); }}>
                <react_1.IonList style={{ overflowY: "scroll" }}>
                    <react_1.IonListHeader>
                        <react_1.IonLabel>Confirm Transaction</react_1.IonLabel>
                    </react_1.IonListHeader>
                    <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("from")}</react_1.IonLabel>
                        <react_1.IonText className="work-break text-small">{transaction && transaction.from}</react_1.IonText>
                    </react_1.IonItem>
                    <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("to")}</react_1.IonLabel>
                        <react_1.IonText className="work-break text-small">{transaction && transaction.to}</react_1.IonText>
                    </react_1.IonItem>
                    <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("value")}</react_1.IonLabel>
                        <react_1.IonText slot="end">{transaction && utils.fromValue(value, utils.getCyDecimal(transaction.cy, types_1.ChainType[transaction.chain])).toString(10)} {transaction === null || transaction === void 0 ? void 0 : transaction.cy}</react_1.IonText>
                    </react_1.IonItem>
                    {transaction && transaction.nonce &&
            <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">Nonce</react_1.IonLabel>
                        <react_1.IonText slot="end">{transaction && new bignumber_js_1.default(transaction.nonce).toString(10)}</react_1.IonText>
                    </react_1.IonItem>}
                    {(transaction === null || transaction === void 0 ? void 0 : transaction.chain) != types_1.ChainType.TRON &&
            <react_1.IonItem>
                            <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("minerFee")}</react_1.IonLabel>
                            <react_1.IonText slot="end">
                                {this.fee()} {transaction === null || transaction === void 0 ? void 0 : transaction.feeCy}<br />
                                <react_1.IonText color="medium" className="text-small">
                                    Gas: {transaction && utils.fromValue(transaction.gas, 0).toString(10)} x
                                    {transaction && utils.fromValue(transaction.gasPrice, 9).toString(10)}
                                    {utils.gasUnit(transaction ? transaction.chain : 2)}
                                </react_1.IonText>
                            </react_1.IonText>
                        </react_1.IonItem>}
                    {transaction && transaction.data && transaction.chain != types_1.ChainType.TRON &&
            <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("data")}</react_1.IonLabel>
                        <react_1.IonText className="work-break text-small">{transaction && transaction.data}</react_1.IonText>
                    </react_1.IonItem>}
                    {transaction && transaction.input &&
            <react_1.IonItem>
                        <react_1.IonLabel position="stacked" color="medium">{i18n_1.default.t("input")}</react_1.IonLabel>
                        <react_1.IonText className="work-break text-small">{transaction && transaction.input}</react_1.IonText>
                    </react_1.IonItem>}
                </react_1.IonList>
                <react_1.IonRow>
                    <react_1.IonCol size="4">
                        <react_1.IonButton expand="block" mode="ios" fill="outline" onClick={function () {
            _this.setShowActionShell(false);
            _this.props.onCancel();
        }}>{i18n_1.default.t("cancel")}</react_1.IonButton>
                    </react_1.IonCol>
                    <react_1.IonCol size="8">
                        <react_1.IonButton mode="ios" expand="block" onClick={function () {
            // this.setShowActionShell(false)
            _this.setShowPasswordAlert(true);
        }}>{i18n_1.default.t("ok")}</react_1.IonButton>
                    </react_1.IonCol>
                </react_1.IonRow>
            </react_1.IonModal>

            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            <react_1.IonLoading mode="ios" isOpen={showLoading} onDidDismiss={function () { return _this.setShowLoading(false); }} message={'Please wait...'} duration={60000}/>
            <react_1.IonToast color={!toastColor ? "warning" : toastColor} position="top" isOpen={showToast} onDidDismiss={function () { return _this.setShowToast(false, toastColor, toastMsg); }} message={toastMsg} duration={1500} mode="ios"/>
        </>;
    };
    return ConfirmTransaction;
}(React.Component));
exports.default = ConfirmTransaction;
