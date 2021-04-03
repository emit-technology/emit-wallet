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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("@ionic/react");
var utils = require("../utils");
var bignumber_js_1 = require("bignumber.js");
var icons_1 = require("ionicons/icons");
var i18n_1 = require("../locales/i18n");
var EpochAttribute = /** @class */ (function (_super) {
    __extends(EpochAttribute, _super);
    function EpochAttribute() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDarkStar = function () {
            var device = _this.props.device;
            var n = utils.calcDark(device ? device.gene : "");
            var ht = [];
            if (n <= 4) {
                for (var i = 0; i < n; i++) {
                    ht.push(<react_1.IonIcon src={icons_1.star} className="dark-star"/>);
                }
                //
                // for(let i=0;i<4-n;i++){
                //     ht.push(<IonIcon src={starOutline} className="dark-star"/>)
                // }
            }
            return ht;
        };
        return _this;
    }
    EpochAttribute.prototype.render = function () {
        var _a = this.props, device = _a.device, driver = _a.driver, showDevice = _a.showDevice, showDriver = _a.showDriver;
        return <>
            {showDevice && device ?
            <div className="progress" style={{ minHeight: "80px" }}>
                    <react_1.IonRow>
                        <react_1.IonCol size="7">
                            <react_1.IonText color="white" className="text-little">AXE{(device === null || device === void 0 ? void 0 : device.category) && "(" + utils.ellipsisStr(device.ticket) + ")"}</react_1.IonText>
                        </react_1.IonCol>
                        <react_1.IonCol size="5">
                            <div style={{ textAlign: "right" }}>
                                <react_1.IonText color="white" className="text-little">{i18n_1.default.t("health")}: {device && utils.fromValue(device.power, 16).toFixed(0, 1) + "/" + utils.fromValue(device.capacity, 16).toFixed(0, 1)}</react_1.IonText>
                            </div>
                        </react_1.IonCol>
                    </react_1.IonRow>
                    <div style={{ padding: "0 12px" }}>
                        <react_1.IonProgressBar className="progress-background-health" value={device && (new bignumber_js_1.default(device.capacity).toNumber() > 0 ? new bignumber_js_1.default(device.power).dividedBy(new bignumber_js_1.default(device.capacity)).toNumber() : 0)}/>
                        <div style={{ padding: "2px 0" }}></div>
                        <react_1.IonProgressBar className="progress-background" value={device && utils.fromValue(device.rate, 18).toNumber()}/>
                        <react_1.IonRow>
                            <react_1.IonCol size="7">
                                {this.renderDarkStar()}
                            </react_1.IonCol>
                            <react_1.IonCol size="5">
                                <div style={{ textAlign: "right" }}>
                                    <react_1.IonText color="white" className="text-little">{i18n_1.default.t("rate")}: {utils.getDeviceLv(device && device.rate)}%</react_1.IonText>
                                </div>
                            </react_1.IonCol>
                        </react_1.IonRow>

                    </div>
                </div> :
            showDevice && <div className="progress" style={{ minHeight: "80px" }}>
                        <react_1.IonRow>
                            <react_1.IonCol size="7">
                                <react_1.IonText color="white" className="text-little">AXE</react_1.IonText>
                            </react_1.IonCol>
                            <react_1.IonCol size="5">
                                <div style={{ textAlign: "right" }}>
                                    <react_1.IonText color="white" className="text-little">{i18n_1.default.t("health")}: 0</react_1.IonText>
                                </div>
                            </react_1.IonCol>
                        </react_1.IonRow>
                        <div style={{ padding: "0 12px" }}>
                            <react_1.IonProgressBar className="progress-background-health" value={0}/>
                            <div style={{ padding: "2px 0" }}></div>
                            <react_1.IonProgressBar className="progress-background" value={0}/>
                            <div style={{ textAlign: "right" }}>
                                <react_1.IonText color="white" className="text-little">{i18n_1.default.t("rate")}: 0.00%</react_1.IonText>
                            </div>
                        </div>
                    </div>}

            {showDriver && driver ?
            <div className="progress" style={{ minHeight: "45px" }}>
                        <react_1.IonRow>
                            <react_1.IonCol size="7">
                                <react_1.IonText color="white" className="text-little">DRIVER</react_1.IonText>
                            </react_1.IonCol>
                        </react_1.IonRow>
                        <div style={{ padding: "0 12px" }}>
                            <react_1.IonProgressBar className="progress-background" value={driver && utils.fromValue(driver.rate, 16).toNumber() > 0 ? (utils.fromValue(driver.rate, 16).div(100).toNumber()) : 0}/>
                            <div style={{ textAlign: "right" }}>
                                <react_1.IonText color="white" className="text-little">{i18n_1.default.t("rate")}: {driver && utils.getDeviceLv(driver.rate)}%</react_1.IonText>
                            </div>
                        </div>
                    </div> :
            showDriver && <div className="progress" style={{ minHeight: "45px" }}>
                        <react_1.IonRow>
                            <react_1.IonCol size="7">
                                <react_1.IonText color="white" className="text-little">DRIVER</react_1.IonText>
                            </react_1.IonCol>
                        </react_1.IonRow>
                        <div style={{ padding: "0 12px" }}>
                            <react_1.IonProgressBar className="progress-background" value={0}/>
                            <div style={{ textAlign: "right" }}>
                                <react_1.IonText color="white" className="text-little">{i18n_1.default.t("rate")}: 0.00%</react_1.IonText>
                            </div>
                        </div>
                    </div>}
        </>;
    };
    return EpochAttribute;
}(React.Component));
exports.default = EpochAttribute;
