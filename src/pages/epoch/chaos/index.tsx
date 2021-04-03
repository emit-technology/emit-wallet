import * as React from 'react';
import {MinerScenes} from "../miner";

import EpochOrigin from "../../../components/EpochOrigin";
class Chaos extends React.Component<any, any>{

    render() {
        return (
            <EpochOrigin scenes={MinerScenes.chaos}>
                <div className="chaos">
                    <div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="display-n">
                        <img src={"./assets/img/epoch/axe_0.png"}/>
                    </div>
                    <div className="display-n">
                        <img src={"./assets/img/epoch/axe_1.png"}/>
                    </div>
                </div>

            </EpochOrigin>
        );
    }
}

export default Chaos