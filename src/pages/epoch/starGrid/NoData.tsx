import * as React from 'react';
interface Props{
    title:string
}
export const NoData:React.FC<Props> = ({title})=>{
    return <div>
        <div style={{textAlign:"center",padding:"12px"}}>
            <img src="./assets/img/common/no-data.png" style={{width:"100px",opacity:"0.1"}}/>
            <div style={{color:"#ddd",marginTop:"12px"}}>{title}</div>
        </div>
    </div>
}