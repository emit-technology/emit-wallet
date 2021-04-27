import * as React from 'react';
import * as utils from "../utils"
import CardTransform from "./CardTransform";
import {NftInfo} from "../types";

interface Props {
    data: Array<NftInfo>
}

class NFCRender extends React.Component<Props, any> {

    state: any = {
        showModal: false,
    }

    componentDidMount() {
        // this.init().catch(e => {
        //     console.error(e)
        // })
    }
    //
    // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
    //     if(prevProps != this.props){
    //         this.init().catch(e => {
    //             console.error(e)
    //         })
    //     }
    // }

    // init = async () => {
    //     const {data} = this.props
    //     if(!data){
    //         return
    //     }
    //     const mateData:any = {};
    //     for(let d of data){
    //         //TODO for test
    //         mateData[d.value]  = META_TEMP[d.symbol]
    //
    //         //
    //         // if(!d.uri){
    //         //     continue;
    //         // }
    //         // const rest = await rpc.req(d.uri,{})
    //         // mateData[d.value] = rest
    //     }
    //     this.setState({
    //         mateData:mateData
    //     })
    // }

    showModal = (v:any,f:boolean)=>{
        this.setState({
            metaInfo:v,
            showModal:f
        })
    }

    render() {
        const {data} = this.props;
        return <>
            <div className="card-page">
                <div className="card-inset">
                    {
                        data && data.map((v: NftInfo,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            // const meta = v.metaData?v.metaData:{};
                            return <CardTransform info={v}/>
                        })
                    }

                </div>
            </div>
        </>;
    }
}

export default NFCRender