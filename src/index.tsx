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

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { Plugins,StatusBarStyle } from '@capacitor/core';
import url from "./utils/url";
import selfStorage from "./utils/storage";

const accountId = selfStorage.getItem("accountId");
if(accountId){
    url.accountUnlock()
}

setTimeout(()=>{
    Plugins.SplashScreen.hide().then(()=>{
        console.log("App started , hide splash!")
    });

},1000)



let lastBackButtonTime = 0;
Plugins.App.addListener("backButton",()=>{
    const data:any = sessionStorage.getItem("history");
    if(data){
        const pathArr = data && JSON.parse(data)
        if(pathArr.length == 0){
            if(lastBackButtonTime>0 && (Date.now() - lastBackButtonTime < 1000)){
                Plugins.App.exitApp();
            }else{
                lastBackButtonTime = Date.now();
                Plugins.Toast.show({text:"Click back button twice to exit EMIT Wallet.",duration:"short"})
            }
        }else{
            url.back();
        }
    }else{
        if(lastBackButtonTime>0 && (Date.now() - lastBackButtonTime < 1000)){
            Plugins.App.exitApp();
        }else{
            lastBackButtonTime = Date.now();
            Plugins.Toast.show({text:"Click back button twice to exit EMIT Wallet.",duration:"short"})
        }
    }
})

document.addEventListener('ionBackButton', (ev:any) => {
    ev.detail.register(10, () => {
        console.log('Handler was called!');
    });
});

Plugins.StatusBar.setStyle({style:StatusBarStyle.Dark})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
