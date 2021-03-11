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
var i18n_1 = require("../../locales/i18n");
var url_1 = require("../../utils/url");
var walletWorker_1 = require("../../worker/walletWorker");
var Unlock = /** @class */ (function (_super) {
    __extends(Unlock, _super);
    function Unlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            password: "",
            showToast: false,
            toastMessage: "",
            showProgress: false,
            showPasswordTips: false
        };
        _this.setShowToast = function (f, m) {
            _this.setState({
                showToast: f,
                toastMessage: m
            });
        };
        _this.confirm = function () { return __awaiter(_this, void 0, void 0, function () {
            var password, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = this.state.password;
                        if (!password) {
                            this.setShowToast(true, "Please Input Password!");
                            return [2 /*return*/];
                        }
                        this.setState({
                            showProgress: true
                        });
                        return [4 /*yield*/, walletWorker_1.default.unlockWallet(password)];
                    case 1:
                        rest = _a.sent();
                        if (rest) {
                            this.setState({
                                showProgress: false
                            });
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    Unlock.prototype.componentDidMount = function () {
    };
    Unlock.prototype.render = function () {
        var _this = this;
        var _a = this.state, showToast = _a.showToast, toastMessage = _a.toastMessage, showProgress = _a.showProgress, password = _a.password;
        return <>
            <react_1.IonPage>
                <react_1.IonContent fullscreen>
                    <react_1.IonHeader>
                        <react_1.IonToolbar mode="ios" color="primary">
                            <react_1.IonTitle>
                                <react_1.IonText>{i18n_1.default.t("unlock")} {i18n_1.default.t("wallet")}</react_1.IonText>
                            </react_1.IonTitle>
                        </react_1.IonToolbar>
                        {showProgress && <react_1.IonProgressBar type="indeterminate"/>}
                    </react_1.IonHeader>
                    <div style={{ padding: "15px 15px 0", textAlign: "center" }}>
                        <img src={"./assets/img/welcome.png"} style={{ width: "200px" }}/>
                        <h1>Welcome Back!</h1>
                        <p><react_1.IonText color="medium">The decentralized word waits</react_1.IonText></p>
                    </div>
                    <div style={{ padding: "0 24px" }}>
                        <react_1.IonList>
                            <react_1.IonItem mode="ios">
                                <react_1.IonLabel position="floating"><react_1.IonText color="medium">{i18n_1.default.t("wallet")} {i18n_1.default.t("password")}</react_1.IonText></react_1.IonLabel>
                                <react_1.IonInput mode="ios" type="password" value={password} onIonChange={function (e) {
            _this.setState({
                password: e.target.value
            });
        }}/>
                            </react_1.IonItem>
                        </react_1.IonList>
                    </div>
                    <div style={{ padding: "12px 24px 0" }}>
                        <react_1.IonButton mode="ios" expand="block" size="large" disabled={!password || showProgress} onClick={function () {
            _this.confirm().then(function () {
                url_1.default.home();
            }).catch(function (e) {
                _this.setState({
                    showProgress: false
                });
                var err = typeof e == "string" ? e : e.message;
                _this.setShowToast(true, err);
            });
        }}>{showProgress && <react_1.IonSpinner name="bubbles"/>}{i18n_1.default.t("unlock")}</react_1.IonButton>
                    </div>
                    <react_1.IonToast mode="ios" isOpen={showToast} color="warning" position="top" onDidDismiss={function () { return _this.setShowToast(false); }} message={toastMessage} duration={2000}/>
                </react_1.IonContent>
            </react_1.IonPage>
        </>;
    };
    return Unlock;
}(React.Component));
exports.default = Unlock;
