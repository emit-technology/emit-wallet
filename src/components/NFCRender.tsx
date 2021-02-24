import * as React from 'react';
import {IonCol, IonContent,IonImg,IonChip, IonButton,IonCard,IonCardContent,IonCardSubtitle,IonCardHeader,IonCardTitle, IonModal, IonGrid, IonLabel, IonList, IonListHeader, IonRow} from "@ionic/react";
import rpc from "../rpc";

interface Props {
    data: Array<any>
}

class NFCRender extends React.Component<Props, any> {

    state: any = {
        showModal: false,
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if(!prevProps.data || prevProps.data.length == 0){
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {
        const {data} = this.props
        if(!data){
            return
        }
        console.log("data:", data)
        const mateData:any = {};
        for(let d of data){
            //TODO for test
            mateData[d.value]  = {
                "name": "Herbie Starbelly",
                "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
                "image": d.chain=="SERO"?"http://localhost:8008/assets/img/dark.png":"http://localhost:8008/assets/img/light.png",
                "attributes": [{}]
            }

            //
            // if(!d.uri){
            //     continue;
            // }
            // const rest = await rpc.req(d.uri,{})
            // mateData[d.value] = rest
        }
        this.setState({
            mateData:mateData
        })
    }

    showModal = (v:any,f:boolean)=>{
        this.setState({
            metaInfo:v,
            showModal:f
        })
    }

    render() {
        const {data} = this.props;
        const {showModal,mateData,metaInfo} = this.state;
        return <>
            <IonList>
                <IonListHeader>
                    <IonLabel>Medal</IonLabel>
                </IonListHeader>
            </IonList>
            <IonGrid>
                <IonRow>
                    {
                        data && data.map((v: any) => {
                            return <IonCol size={"3"}>
                                <div className="elements" onClick={()=>this.showModal(v,true)}>
                                    {mateData && mateData[v.value] && <img src={mateData[v.value].image}/>}
                                </div>

                            </IonCol>
                        })
                    }
                </IonRow>
            </IonGrid>

            <IonModal isOpen={showModal} onDidDismiss={()=>{this.showModal("",false)}} mode="ios" swipeToClose={true}>
                <div className="nfc-modal">
                    {
                        metaInfo && mateData && mateData[metaInfo.value] && <IonCard>
                            <IonImg src={mateData[metaInfo.value].image}/>
                            <IonCardHeader>
                                <IonCardTitle>{mateData[metaInfo.value].name} <IonButton size="small" fill="outline">CROSS</IonButton></IonCardTitle>
                                <IonCardSubtitle>
                                    {metaInfo && metaInfo.chain} Chain
                                </IonCardSubtitle>
                            </IonCardHeader>

                            <IonCardContent>
                                {mateData[metaInfo.value].description}
                            </IonCardContent>

                            <IonRow>
                                <IonCol>
                                    <IonButton expand="block" fill="outline" size="small" onClick={() => this.showModal("",false)}>Share</IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton expand="block" fill="outline" size="small" onClick={() => this.showModal("",false)}>Transfer</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonCard>
                    }
                    <div style={{position:"fixed",bottom:"0",padding:"15px",width:"100%"}}>
                        <IonButton expand="block" onClick={() => this.showModal("",false)}>Close Modal</IonButton>
                    </div>
                </div>
            </IonModal>
        </>;
    }
}

export default NFCRender