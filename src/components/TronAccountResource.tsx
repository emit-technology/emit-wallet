import {IonCol, IonProgressBar, IonRow, IonText} from "@ionic/react";
import * as React from "react";

/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */

interface Props {
    accountResource:any
}

class TronAccountResource extends React.Component<Props, any>{

    availableBandwidth = (accountResource:any)=>{
        if(!accountResource || !accountResource.freeNetLimit){
            return 0;
        }
        const r = accountResource.freeNetLimit - (accountResource.freeNetUsed?accountResource.freeNetUsed:0)
        return r <= 0 ?0:r;
    }

    availableEnergy = (accountResource:any)=>{
        if(!accountResource || !accountResource.EnergyLimit){
            return 0;
        }
        const r = accountResource.EnergyLimit - (accountResource.EnergyUsed?accountResource.EnergyUsed:0)
        return r <= 0 ?0:r;
    }

    render() {
        const accountResource:any = this.props.accountResource;
        return <>
            <IonRow color="light">
                <IonCol size="12">
                    <IonRow>
                        <IonCol size="4" className="text-small-x2">
                            Bandwidth
                        </IonCol>
                        <IonCol size="8" className="text-small-x2 ion-text-right">
                            {this.availableBandwidth(accountResource)}/<IonText color="medium">{accountResource&&accountResource.freeNetLimit}</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonProgressBar className="net-progress" value={this.availableBandwidth(accountResource)/(accountResource&&accountResource.freeNetLimit?accountResource.freeNetLimit:1)}/>
                        </IonCol>
                    </IonRow>
                </IonCol>
                <IonCol size="12">
                    <IonRow>
                        <IonCol size="4" className="text-small-x2">
                            Energy
                        </IonCol>
                        <IonCol size="8" className="text-small-x2 ion-text-right">
                            {this.availableEnergy(accountResource)}/<IonText color="medium">{accountResource&&accountResource.EnergyLimit?accountResource.EnergyLimit:0}</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12" className="text-small-x2">
                            <IonProgressBar className="net-progress" value={this.availableEnergy(accountResource)/(accountResource&&accountResource.EnergyLimit?accountResource.EnergyLimit:1)}/>
                        </IonCol>
                    </IonRow>
                </IonCol>
            </IonRow>
        </>;
    }
}

export default TronAccountResource