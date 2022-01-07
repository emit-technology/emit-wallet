import * as React from 'react';
import {Counter} from "../../types";
import CounterSvg from "../../pages/epoch/starGrid/counter-svg";
import * as utils from "../../utils";

interface CounterProps {
 counter:Counter
}

const CounterAttribute:React.FC<CounterProps> = ({counter}) => {

    return (
        <>
            <div className="owner-info" >
                <div className="avatar-l">
                    <div className="hex-head">
                        <CounterSvg counter={counter} />
                    </div>
                    <div className="attr">
                        <div><img src="./assets/img/epoch/stargrid/icons/sword.png" width={20}/></div>
                        <div><img src="./assets/img/epoch/stargrid/icons/defense.png" width={20}/></div>
                        <div><img src="./assets/img/epoch/stargrid/icons/shot.png" width={20}/></div>
                        <div><img src="./assets/img/epoch/stargrid/icons/lucky.png" width={20}/></div>
                    </div>
                    <div className="attr">
                        <div>{counter.force}</div>
                        <div>{counter.defense}</div>
                        <div>{counter.move}</div>
                        <div>{counter.luck}</div>
                    </div>
                </div>
                <div className="cap-info">
                    <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(counter.capacity,18).toFixed(2,2)}</span></div>
                    <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(counter.rate,16).toFixed(2,2)}%</span></div>
                    <div className="attribute" ><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/>
                        <span>{counter.level}</span>
                    </div>
                </div>
            </div>
        </>
    )
};

export default CounterAttribute;