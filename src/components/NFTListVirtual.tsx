import * as React from 'react';

import useVirtual from "react-cool-virtual";
import CardTransform from "./CardTransform";

interface Props {
    data: Array<any>
}

export const NFTListVirtual: React.FC<Props> = ({data}) => {
    const {outerRef,innerRef,items} = useVirtual({
        itemCount: data.length,
        itemSize: 50
    })
    return <>
        {
            //@ts-ignore
            <div ref={outerRef} style={{height: "100vh",overflow: "auto"}}>
                {
                    //@ts-ignore
                    <div ref={innerRef}>
                        {
                            items.map(({index,measureRef})=>{
                                const v = data[index];
                                return <div ref={measureRef} key={index}>
                                    <CardTransform info={v}/>
                                </div>
                            })
                        }
                    </div>

                }
            </div>
        }
    </>
}