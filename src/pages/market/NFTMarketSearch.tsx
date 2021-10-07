import * as React from "react";
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonSearchbar,
    IonLabel,
    IonButton,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList, IonListHeader, IonItem, IonChip, IonRow, IonCol
} from "@ionic/react";
import {chevronBack, funnelOutline} from "ionicons/icons";
import url from "../../utils/url";
import {menuController} from "@ionic/core";
import "./NFTMarketPlace.scss"
import {MarketItemQuery} from "../../rpc/epoch/market";
import {fromValue, toValue} from "../../utils";
import selfStorage from "../../utils/storage";
import {Plugins} from "@capacitor/core";

interface State{
    queryFilter:MarketItemQuery
}
class NFTMarketSearch extends React.Component<any, State>{

    state:State = {
        queryFilter: {type:1}
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })

        const item:any = selfStorage.getItem("marketSearch")
        console.log(item)
        if(item){
            delete item.ticket;
            this.setState({
                queryFilter:item
            })
        }
    }

    search = async ()=>{
        // type: number // 1 DEVICES
        // ticket?: string
        // cy?: string
        // showId?: Range //[0,256]
        // gene?: number //0 default ,1:Yes,2:No
        // price?: Range
        // capacity?: Range
        // rate?: Range
        // power?: Range
        // priceSort?: number //-1,1
        // rateSort?: number // -1,1
        // powerSort?: number // -1,1
    }

    render() {
        const {queryFilter} = this.state;
        return <IonPage>

            <IonHeader mode="ios">
                <IonToolbar mode="ios" color="primary" className="heard-bg">
                    <IonIcon src={chevronBack} slot="start"  style={{
                        color: "#edcc67",
                    }} size="large" onClick={()=>{
                        Plugins.StatusBar.setBackgroundColor({
                            color: "#194381"
                        }).catch(e => {
                        });
                        url.back()
                    }}/>
                    <IonTitle   style={{
                        color: "#edcc67",
                    }}>
                        Search
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen color="light">
                <IonSearchbar mode="ios" placeholder="Token ID" onIonChange={(e)=>{
                    queryFilter.ticket = e.detail.value;
                    this.setState({
                        queryFilter:queryFilter
                    })
                }}/>

                <div style={{padding:"12px 0 50px"}}>
                    {/*<IonList id="inbox-list" mode="md">*/}
                    {/*    <IonListHeader>Category</IonListHeader>*/}
                    {/*    <IonItem className="ion-text-wrap">*/}
                    {/*        <IonChip color="danger" style={{border:"1px solid"}}>*/}
                    {/*            <IonLabel>Device</IonLabel>*/}
                    {/*        </IonChip>*/}
                    {/*        <IonChip color="dark">*/}
                    {/*            <IonLabel>Medal</IonLabel>*/}
                    {/*        </IonChip>*/}
                    {/*    </IonItem>*/}
                    {/*</IonList>*/}

                    <IonList id="inbox-list" mode="md">
                        <IonListHeader>Attribute</IonListHeader>
                        <IonItem className="ion-text-wrap">
                            <IonChip color={queryFilter.gene&&queryFilter.gene==2?"danger":"dark"}
                                     style={{border:queryFilter.gene&&queryFilter.gene==2?"1px solid":""}} onClick={()=>{
                                if(queryFilter.gene&&queryFilter.gene==2){
                                    queryFilter.gene=0
                                }else{
                                    delete queryFilter.darkStar;
                                    queryFilter.gene=2;
                                }
                                this.setState({queryFilter:queryFilter})
                            }}>
                                <IonLabel>BLANK</IonLabel>
                            </IonChip>
                            <IonChip color={queryFilter.darkStar&&queryFilter.darkStar>=1?"danger":"dark"}
                                     style={{border:queryFilter.darkStar&&queryFilter.darkStar>=1?"1px solid":""}} onClick={()=>{
                                if(queryFilter.darkStar&&queryFilter.darkStar>=1){
                                    delete queryFilter.darkStar
                                }else{
                                    delete queryFilter.gene
                                    queryFilter.darkStar=5;
                                }
                                this.setState({queryFilter:queryFilter})
                            }}>
                                <IonLabel>DARK</IonLabel>
                            </IonChip>
                            <IonChip color={queryFilter.darkStar===0?"danger":"dark"}
                                     style={{border:queryFilter.darkStar===0?"1px solid":""}} onClick={()=>{
                                if(queryFilter.darkStar===0){
                                    delete queryFilter.darkStar;
                                }else{
                                    delete queryFilter.gene
                                    queryFilter.darkStar=0;
                                }
                                this.setState({queryFilter:queryFilter})
                            }}>
                                <IonLabel>LIGHT</IonLabel>
                            </IonChip>
                        </IonItem>
                    </IonList>

                    <IonList id="inbox-list" mode="md">
                        <IonListHeader>Price</IonListHeader>
                        <IonItem>
                            <IonRow>
                                <IonCol><input size={15} className="input-price" value={
                                    queryFilter&&queryFilter.price&&queryFilter.price.min
                                        ?fromValue(queryFilter.price.min,18).toString(10):""
                                } onChange={(e)=>{
                                    const value = toValue(e.target.value,18).toString(10)
                                    if(queryFilter.price){
                                        queryFilter.price.min = value;
                                    }else{
                                        queryFilter.price = {min:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                                <IonCol>-</IonCol>
                                <IonCol><input  size={15} className="input-price" value={
                                    queryFilter&&queryFilter.price&&queryFilter.price.max
                                        ?fromValue(queryFilter.price.max,18).toString(10):""
                                } onChange={(e)=>{
                                    const value = toValue(e.target.value,18).toString(10)
                                    if(queryFilter.price){
                                        queryFilter.price.max = value;
                                    }else{
                                        queryFilter.price = {max:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
                    <IonList id="inbox-list" mode="md">
                        <IonListHeader>Healthy</IonListHeader>
                        <IonItem>
                            <IonRow>
                                <IonCol><input size={15} className="input-price" value={
                                    queryFilter&&queryFilter.capacity&&queryFilter.capacity.min
                                        ?fromValue(queryFilter.capacity.min,18).toString(10):""
                                }   onChange={(e)=>{
                                    const value = toValue(e.target.value,18).toString(10)
                                    if(queryFilter.capacity){
                                        queryFilter.capacity.min = value;
                                    }else{
                                        queryFilter.capacity = {min:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                                <IonCol>-</IonCol>
                                <IonCol><input  size={15} className="input-price"  value={
                                    queryFilter&&queryFilter.capacity&&queryFilter.capacity.max
                                        ?fromValue(queryFilter.capacity.max,18).toString(10):""
                                } onChange={(e)=>{
                                    const value = toValue(e.target.value,18).toString(10)
                                    if(queryFilter.capacity){
                                        queryFilter.capacity.max = value;
                                    }else{
                                        queryFilter.capacity = {max:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
                    <IonList id="inbox-list" mode="md">
                        <IonListHeader>Rate(%)</IonListHeader>
                        <IonItem>
                            <IonRow>
                                <IonCol><input size={15} className="input-price"   onChange={(e)=>{
                                    const value = toValue(e.target.value,16).toString(10)
                                    if(queryFilter.rate){
                                        queryFilter.rate.min = value;
                                    }else{
                                        queryFilter.rate = {min:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                                <IonCol>-</IonCol>
                                <IonCol><input  size={15} className="input-price"  onChange={(e)=>{
                                    const value = toValue(e.target.value,16).toString(10)
                                    if(queryFilter.rate){
                                        queryFilter.rate.max = value;
                                    }else{
                                        queryFilter.rate = {max:value}
                                    }
                                    this.setState({
                                        queryFilter:queryFilter
                                    })
                                }}/></IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
                    <IonList id="inbox-list" mode="md">
                        <IonListHeader>Style</IonListHeader>
                        <IonItem className="ion-text-wrap">
                            <p>
                                {["COMMON","MAGIC","RARE","LEGENDARY"].map((v,i)=>{
                                    const showId = queryFilter.showId;
                                    let convertStyle = ""
                                    if(showId){
                                        if(showId.min && showId.min == "0" && showId.max && showId.max == "2"){
                                            convertStyle = "LEGENDARY"
                                        }else if(showId.min && showId.min == "3" && showId.max && showId.max == "18"){
                                            convertStyle = "RARE"
                                        }else if(showId.min && showId.min == "19" && showId.max && showId.max == "48"){
                                            convertStyle = "MAGIC"
                                        }else if(showId.min && showId.min == "49" && showId.max && showId.max == "255"){
                                            convertStyle = "COMMON"
                                        }
                                    }
                                    console.log(convertStyle ==v,convertStyle)
                                    return <>
                                        <IonChip color={convertStyle ==v?"danger":"dark"} style={{border:convertStyle==v?"1px solid":""}} onClick={()=>{
                                            if(v == "COMMON"){
                                                if(queryFilter.showId && queryFilter.showId.min=="49"){
                                                    delete queryFilter.showId;
                                                }else{
                                                    queryFilter.showId={min:"49",max:"255"}
                                                }
                                            }else if(v == "MAGIC"){
                                                if(queryFilter.showId && queryFilter.showId.min=="19"){
                                                    delete queryFilter.showId;
                                                }else{
                                                    queryFilter.showId={min:"19",max:"48"}
                                                }
                                            }else if(v == "RARE"){
                                                if(queryFilter.showId && queryFilter.showId.min=="3"){
                                                    delete queryFilter.showId;
                                                }else{
                                                    queryFilter.showId={min:"3",max:"18"}
                                                }
                                            }else if(v == "LEGENDARY"){
                                                if(queryFilter.showId && queryFilter.showId.min=="0"){
                                                    delete queryFilter.showId;
                                                }else{
                                                    queryFilter.showId={min:"0",max:"2"}
                                                }
                                            }
                                            this.setState({queryFilter:queryFilter})
                                        }}>
                                            <IonLabel>{v.toUpperCase()}</IonLabel>
                                        </IonChip>
                                    </>
                                })}
                            </p>
                        </IonItem>
                    </IonList>
                    <div className="btn-bottom-menu">
                        <IonButton mode="ios" expand="block" onClick={()=>{
                            console.log(queryFilter)
                            selfStorage.setItem("marketSearch",queryFilter)
                            url.tradeNftMarket()
                        }}>Search</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>;
    }
}

export default NFTMarketSearch