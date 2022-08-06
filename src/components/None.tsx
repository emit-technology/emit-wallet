import * as React from 'react';
import './None.css';

interface Props {
    desc?: string
}
export const NoneData:React.FC<Props> = ({desc = 'NO DATA'}) =>{
    return (<>
        <div className="data-none">
            <img src="./assets/img/none.png"/>
            <div>{desc}</div>
        </div>
    </>);
}
