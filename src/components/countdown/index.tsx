import * as React from 'react';
import "./index.css";

class CountDown extends React.Component<any, any>{




    render() {
        return <>
            <div className="clock">
                <div className="flipper">
                    <div className="gear"></div>
                    <div className="gear"></div>
                    <div className="top">
                        <div className="text">00</div>
                    </div>
                    <div className="bottom">
                        <div className="text">00</div>
                    </div>
                </div>
                <div className="flipper">
                    <div className="gear"></div>
                    <div className="gear"></div>
                    <div className="top">
                        <div className="text">00</div>
                    </div>
                    <div className="bottom">
                        <div className="text">00</div>
                    </div>
                </div>
                <div className="flipper">
                    <div className="gear"></div>
                    <div className="gear"></div>
                    <div className="top">
                        <div className="text">00</div>
                    </div>
                    <div className="bottom">
                        <div className="text">00</div>
                    </div>
                </div>
            </div>
        </>;
    }
}

export default CountDown