import * as React from 'react';

import {MinerScenes} from "../miner";
import EpochOrigin from "../../../components/EpochOrigin";
import {DeviceInfo} from "../../../contract/epoch/sero/types";

interface State {
    device?:DeviceInfo
}

class Altar extends React.Component<any, State> {

    state:State = {
    }

    loadDevice = (d?:DeviceInfo)=>{
        this.setState({
            device:d
        })
    }

    render() {
        const hasDevice = this.state.device && this.state.device.category;

        return (
            <EpochOrigin scenes={MinerScenes.altar} loadDevice={(d)=>this.loadDevice(d)}>
                <div className="altar">
                    <div className="altar-img-1">
                        <img src={"./assets/img/epoch/altar_1.png"}  style={{animation:hasDevice&&"turn 60s linear infinite"}}/>
                    </div>
                    <div className="altar-img-2">
                        <img src={"./assets/img/epoch/altar_2.png"}  style={{animation:hasDevice&&"turn-left 40s linear infinite"}}/>
                    </div>
                    <div className="altar-img-3">
                        <img src={"./assets/img/epoch/altar_3.png"} style={{animation:hasDevice&&"turn 60s linear infinite"}}/>
                    </div>
                    <div  className="altar-img-4">
                        <img src={"./assets/img/epoch/axe_0.png"} className="display-n"/>
                        <div className="altar-img-4b"></div>
                    </div>
                    <div className="altar-img-5 display-n">
                        <img src={"./assets/img/epoch/axe_1.png"}/>
                    </div>
                </div>
            </EpochOrigin>
        );
    }
}

export default Altar