import * as React from 'react';
import {MinerScenes} from "../miner";

import EpochOrigin from "../../../components/EpochOrigin";
import {DeviceInfo} from "../../../contract/epoch/sero/types";
import * as utils from "../../../utils";

interface State {
    device?:DeviceInfo
}

class Chaos extends React.Component<any, State>{

    state:State = {
    }

    loadDevice = (d?:DeviceInfo)=>{
        this.setState({
            device:d
        })
    }

    render() {
        const {device} = this.state;
        const hasDevice = device && device.category;
        return (
            <EpochOrigin scenes={MinerScenes.chaos} loadDevice={(d)=>this.loadDevice(d)}>
                <div className="chaos">
                    <div>
                        <div style={{animation: hasDevice && "star-move-out 20s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 16s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 10s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 8s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 17s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 14s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 11s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 7s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 9s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 5s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                        <div style={{animation: hasDevice && "star-move-out 6s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>
                    </div>
                    <div className="display-n">
                        <img src={`./assets/img/epoch/device/${utils.calcStyle(device && device.gene).style}.png`} />
                    </div>
                    {/*<div className="display-n">*/}
                    {/*    <img src={"./assets/img/epoch/axe_1.png"}/>*/}
                    {/*</div>*/}
                </div>

            </EpochOrigin>
        );
    }
}

export default Chaos