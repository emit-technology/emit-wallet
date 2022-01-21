import * as React from 'react';
import "./index.css";
import BigNumber from "bignumber.js";
import Countdown from "react-countdown";

interface CountdownProps {
    time: number;
    className?:string
    showDay?:boolean
}

export const CountDown: React.FC<CountdownProps> = ({time,showDay,className}) => {

    let renderer = ({days,hours, minutes, seconds, completed}) => {
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
        return <div className={className?className:"countdown"}>{days>0?`${days} days`:""} {h}:{m}:{s}</div>;
    };

    return <Countdown date={time} renderer={renderer} className={className}/>
}