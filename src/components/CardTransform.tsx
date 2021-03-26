import * as React from 'react';
import {IonButton, IonCol, IonGrid, IonRow, IonText} from '@ionic/react'

import "./CardTransform.scss"
import url from "../utils/url";
import {ChainType} from "../types";

interface Props {
    src: string
    title: string
    subTitle: string
    chain: ChainType
    timestamp: number
    description: string
    dna: string
    symbol:string
}

interface State {
    deg:number
}

class CardTransform extends React.Component<Props, State> {

    state: State = {
        deg:0
    }

    constructor(props: Props) {
        super(props);
    }


    componentDidMount() {
    }

    change = ()=>{
        let {deg} = this.state;
        if(deg == 0 ){
            deg = 180;
        }else{
            deg = 0 ;
        }
        this.setState({
            deg:deg
        })
        // const d:any = document.getElementsByClassName("card-display")[0];
        // console.log(d);
        // d.style.transform = "transform: rotateY(0deg);"
    }

    render() {
        const {deg} = this.state;
        const {src, title, subTitle, chain, timestamp, description,dna,symbol} = this.props;
        return <>
            <div className="n-card">
                <div className="card-display" style={{transform: `rotateY(${deg}deg)`}} onClick={()=>{
                    this.change()
                }}>
                    <div className="card-front">
                        <img src={src}/>
                    </div>
                    <div className="card-back">
                        <img src={src}/>
                        <div className="card-back-f">
                            <IonGrid>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <h3>{title}</h3>
                                        <p><IonText>{subTitle}</IonText></p>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <div>Chain</div>
                                        <div>{chain}</div>
                                    </IonCol>
                                    <IonCol className="col-line">
                                        <div>Year</div>
                                        <div>{new Date(timestamp).getFullYear()}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <p>
                                            <IonText>
                                                {description}
                                            </IonText>
                                        </p>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </div>
                </div>
                <div className="card-foo">
                    <p><IonText color="light">{title}</IonText></p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonButton color="light" mode="ios" fill="outline" expand="block" size="small"  onClick={()=>{
                                    url.tunnelNFT(symbol,chain,subTitle)
                                }}>CROSS</IonButton>
                            </IonCol>
                            <IonCol size="6">
                                <IonButton color="light" mode="ios" fill="outline" expand="block" size="small" onClick={() => {
                                    url.transferNFT(symbol,chain,subTitle)
                                }}>Transfer</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </div>

        </>;
    }
}

export default CardTransform