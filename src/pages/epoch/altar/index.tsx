import * as React from 'react';

import {MinerScenes} from "../miner";
import EpochOrigin from "../../../components/EpochOrigin";

class Altar extends React.Component<any, any> {

    render() {
        return (
            <EpochOrigin scenes={MinerScenes.altar}>
                <div className="altar">
                    <div className="altar-img-1"><img src={require("../img/altar_1.png")}/></div>
                    <div className="altar-img-2"><img src={require("../img/altar_2.png")}/></div>
                    <div className="altar-img-3"><img src={require("../img/altar_3.png")}/></div>
                    <div  className="altar-img-4">
                        <img src={require("../img/axe_0.png")} className="display-n"/>
                        <div className="altar-img-4b"></div>
                    </div>
                    <div className="altar-img-5 display-n">
                        <img src={require("../img/axe_1.png")}/>
                    </div>
                </div>
            </EpochOrigin>
        );
    }
}

export default Altar