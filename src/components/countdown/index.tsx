import * as React from 'react';
import "./index.css";
import BigNumber from "bignumber.js";
import Countdown from "react-countdown";
import {IonLabel} from "@ionic/react";

const renderer = ({hours, minutes, seconds, completed}) => {
    if (completed) {
        return <span></span>
    }
    let h = hours, m = minutes, s = seconds;
    if (new BigNumber(hours).toNumber() <= 9) {
        h = "0" + hours;
    }
    if (new BigNumber(minutes).toNumber() <= 9) {
        m = "0" + minutes;
    }
    if (new BigNumber(seconds).toNumber() <= 9) {
        s = "0" + seconds;
    }
    return <div className="countdown">{h}:{m}:{s}</div>;
};

interface CountdownProps {
    second: number
}

export const CountDown: React.FC<CountdownProps> = ({second}) => {
    return <Countdown date={second} renderer={renderer}/>
}