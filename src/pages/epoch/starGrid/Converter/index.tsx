import * as React from "react";
import "./index.css";
import {ENDetails} from "../../../../types";
import * as utils from "../../../../utils";
import BigNumber from "bignumber.js";
import i18n from "../../../../locales/i18n";


interface Props {
    enDetail: ENDetails;
    symbol:string
}
export const Converter:React.FC<Props> = ({enDetail,symbol})=>{

    const driverPercent =  new BigNumber(enDetail.inputEN).dividedBy(new BigNumber(enDetail.driverCapacity)).toNumber()>1?80:
        new BigNumber(enDetail.inputEN).dividedBy(new BigNumber(enDetail.driverCapacity)).toNumber() * 80;

    const counterPercent =  new BigNumber(enDetail.driverOutEN).dividedBy(new BigNumber(enDetail.counterCapacity)).toNumber()>1?80:
        new BigNumber(enDetail.driverOutEN).dividedBy(new BigNumber(enDetail.counterCapacity)).toNumber() * 80;

    const powerPercent = new BigNumber(enDetail.counterOutEN).dividedBy(new BigNumber(enDetail.totalPower)).toNumber()>1?80:
        new BigNumber(enDetail.counterOutEN).dividedBy(new BigNumber(enDetail.totalPower)).toNumber() * 80;

    const planetPercent = new BigNumber(enDetail.planetCapacity).dividedBy(new BigNumber(enDetail.totalPower)).toNumber()>1?80:
        new BigNumber(enDetail.planetCapacity).dividedBy(new BigNumber(enDetail.totalPower)).toNumber() * 80;

    const outputNe = new BigNumber(enDetail.totalPower).comparedTo(new BigNumber(enDetail.counterOutEN)) == -1?
        new BigNumber(enDetail.totalPower):new BigNumber(enDetail.counterOutEN);

    return (<>

        <div>
            <div className="power-boll">
                <div className="boll-box">
                    <div className="convert-title">DRIVER</div>
                    <div className="ne-input" style={{textAlign:"right",paddingRight:"6px"}}>
                        {utils.nFormatter(utils.fromValue(enDetail.inputEN,18),3)}
                        <div className="ne-input-right"></div>
                        <div className="ne-input-desc" style={{textAlign:"right",paddingRight:"6px"}}>EN(B)</div>
                    </div>
                    <div style={{position:"relative"}}>
                        <div className="bundle-boll">
                            <div>
                                {utils.nFormatter(utils.fromValue(enDetail.driverCapacity,18),3)}
                            </div>
                            <div>
                            </div>
                            <div className="bundle-boll-before" style={{height:`${Math.floor(driverPercent)}px`}} ></div>
                        </div>
                        <div className="shadow-boll"></div>
                        <div className="capacity-text"><small>{i18n.t("capacity")}</small></div>
                    </div>
                    <div className="boll-text">X</div>
                    <div className="rate-boll">
                        <div>{utils.fromValue(enDetail.driverRate,16).toFixed(2,2)}%</div>
                        <div className="rate-text"><small>{i18n.t("rate")}</small></div>
                    </div>
                </div>

                <div className="boll-box">
                    <div className="convert-title">COUNTER</div>
                    <div className="ne-input">{utils.nFormatter(utils.fromValue(enDetail.driverOutEN,18),3)}
                        <div className="ne-input-right"></div>
                        <div className="ne-input-desc">EN(D)</div>
                    </div>
                    <div style={{position:"relative"}}>
                        <div className="counter-boll">
                            <div>{utils.nFormatter(utils.fromValue(enDetail.counterCapacity,18),3)}</div>
                            <div>
                            </div>
                            <div className="counter-boll-before" style={{height:`${Math.floor(counterPercent)}px`}} ></div>
                        </div>
                        <div className="counter-shadow-boll"></div>
                        <div className="capacity-text"><small>{i18n.t("capacity")}</small></div>
                    </div>
                    <div className="boll-text">X</div>
                    <div className="rate-boll">
                        <div>{utils.fromValue(enDetail.counterRate,16).toFixed(2,2)}%</div>
                        <div className="rate-text"><small>Rate</small></div>
                    </div>
                </div>

                <div className="boll-box" style={{minWidth:"200px"}}>
                    <div className="convert-title">PLANET <small>({i18n.t("capacity")}: {utils.nFormatter(utils.fromValue(enDetail.planetCapacity,18),3)})</small></div>
                    <div className="ne-input">{utils.nFormatter(utils.fromValue(enDetail.counterOutEN,18),3)}
                        <div className="ne-input-right"></div>
                        <div className="ne-input-desc">EN(C)</div>
                    </div>
                    <div style={{position:"relative"}}>
                        <div className="power-bundle-boll" style={{border:"3px solid darkred",background:"darkred"}}>
                            <div>{utils.nFormatter(utils.fromValue(enDetail.totalPower,18),3)}</div>
                            <div>
                            </div>
                            <div className="power-bundle-boll-before"  style={{height:`${Math.floor(powerPercent)}px`}}></div>
                        </div>
                        <div className="power-bundle-shadow-boll"></div>
                        <div className="capacity-text"><small>{i18n.t("power")}</small></div>
                    </div>
                </div>
                <div className="boll-box">
                    <div className="convert-title">CALC</div>
                    <div className="ne-input" style={{width:"150px",left:"-120px"}}>{utils.nFormatter(utils.fromValue(outputNe,18),3)}
                        <div className="ne-input-right"></div>
                        <div className="ne-input-desc">EN(P)</div>
                    </div>
                    <div className="rate-boll en-boll">
                        <div>{
                            utils.nFormatter(utils.fromValue(outputNe,18),3)
                        }</div>
                        <div className="rate-text"><small>{i18n.t("output")}</small></div>
                    </div>
                    <div className="boll-text">x</div>
                    <div className="rate-boll epe-boll">
                        <div>EPE</div>
                    </div>
                    <div className="boll-text">=</div>
                    <div className="rate-boll outne-boll">
                        <div><small>{utils.nFormatter(utils.fromValue(enDetail.output,18),3)} {symbol}</small></div>
                    </div>
                </div>
            </div>

        </div>

    </>)
}