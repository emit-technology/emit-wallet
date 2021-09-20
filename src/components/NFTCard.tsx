import * as React from 'react';
import "./NFTCard.scss";
import {IonList, IonItem,IonLabel,IonText,IonGrid,IonRow,IonCol,IonItemDivider,IonChip,IonIcon} from "@ionic/react"
import {documentOutline, listOutline, pin, pricetag, pricetagsOutline} from "ionicons/icons";

interface State {
    deg: number
}

interface Props {
    attributes: Array<any>;
    description: string;
    name: string;
}

class NFTCard extends React.Component<Props, State> {

    state: State = {
        deg: 0
    }

    componentDidMount() {

    }

    turnOver = () => {
        let {deg} = this.state;
        if (deg == 0) {
            deg = 180;
        } else {
            deg = 0;
        }
        this.setState({
            deg: deg
        })
    }

    renderAttribute = () => {
        const {attributes} = this.props;
        if (!attributes || attributes.length == 0) {
            return <div/>
        }
        const elems = [];
        for(let attr of attributes){
            const keys = Object.keys(attr);
            for (let k of keys) {
                elems.push(<div>
                    <div className="nft-mkt-attr">
                        <div>{k}</div>
                        <div>
                            {attr[k]}
                        </div>
                    </div>
                </div>)
            }
        }
        return elems;
    }

    render() {
        const {deg} = this.state;
        const {name, description} = this.props;
        return (
            <div>
                <div className="n-card">
                    <div className="card-display" style={{transform: `rotateY(${deg}deg)`}} onClick={(e) => {
                        e.stopPropagation();
                        this.turnOver()
                    }}>
                        <div className="card-front-mkt">
                            {this.props.children}
                        </div>
                        <div className={`card-back-mkt`}>
                            {this.props.children}
                            <div className="card-back-f-mkt">
                                <div className="ion-text-wrap nft-mkt-name">
                                    {name}
                                </div>
                                <IonItemDivider mode="ios" color="primary"><IonIcon icon={pricetagsOutline} />&nbsp;&nbsp;Attributes</IonItemDivider>
                                <IonItem lines="none">
                                    <IonLabel className="ion-text-wrap">
                                        {this.renderAttribute()}
                                    </IonLabel>
                                </IonItem>
                                <IonItemDivider mode="ios" color="primary"><IonIcon icon={listOutline} />&nbsp;&nbsp;Description</IonItemDivider>
                                <IonItem lines="none">
                                    <IonLabel>
                                       <div className="ion-text-wrap nft-mkt-desc">
                                           {description}
                                       </div>
                                    </IonLabel>
                                </IonItem>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NFTCard;