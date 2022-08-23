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

import service from 'walletService';
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import selfStorage from "../utils/storage";
import url from "../utils/url";

class WalletWorker {

    constructor() {

    }

    async importMnemonic(mnemonic: string,name:string,password:string,passwordHint:string,avatar:string) {
        const params: any = {
            mnemonic: mnemonic,
            password: password,
            passwordHint:passwordHint,
            avatar:avatar,
            name:name,
        }
        return new Promise((resolve, reject)=>{
            service.importMnemonic(params, function (data: any) {
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })

    }

    async importPrivateKey(privateKey: string,name:string,password:string,passwordHint:string,avatar:string) {
        const params: any = {
            mnemonic: privateKey,
            password: password,
            passwordHint:passwordHint,
            avatar:avatar,
            name:name,
        }
        return new Promise((resolve, reject)=>{
            service.importPrivateKey(params, function (data: any) {
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })

    }

    async generateMnemonic(){
        return new Promise((resolve, reject)=>{
            service.generateMnemonic(function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async exportMnemonic(accountId:string,password:string){
        return new Promise((resolve, reject)=>{
            service.exportMnemonic(accountId,password,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async exportKeystore(accountId:string){
        return new Promise((resolve, reject)=>{
            service.exportKeystore(accountId,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async exportPrivateKey(accountId:string,password:string,chain:ChainType){
        return new Promise((resolve, reject)=>{
            service.exportPrivateKey(accountId,password,chain,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async accounts():Promise<Array<AccountModel>> {
        return new Promise((resolve, reject)=>{
            service.accounts(function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    const tmp: Array<AccountModel> = data.result;
                    resolve(tmp);
                }
            })
        })
    }

    accountInfoAsync = async (accountId?:string):Promise<any>=>{
        if(!accountId){
            accountId = selfStorage.getItem("accountId");
        }
        return new Promise((resolve, reject) => {
            service.accountInfo(accountId,function (data:any){
                if(data.error){
                    reject(data.error);
                    console.log (data.error)
                }else{
                    const tmp:any = data.result;
                    selfStorage.setItem(accountId,tmp)
                    resolve(tmp);
                }
            })
        })
    }

    getAccountByAddressAndChainId = async (address:string,chain:ChainType) =>{
        if(!address){
            return Promise.reject("From address can not be null.")
        }
        const accounts:Array<AccountModel> = await this.accounts();
        const accountArr:Array<AccountModel> = accounts.filter(v=>{
            if(address.toLowerCase() == v.addresses[chain].toLowerCase()){
                return v
            }
        })
        if(accountArr && accountArr.length > 0 ){
            return accountArr[0]
        }
        return Promise.reject(`Account [${address}] do not exist!`)
    }

    async accountInfo(accountId?:any):Promise<AccountModel>{
        if(!accountId){
            accountId = selfStorage.getItem("accountId");
        }
        if(!accountId){
            // if( window.location.hash.indexOf("account/import") == -1){
            //     url.accountCreate()
            // }
            return;
        }
        return new Promise((resolve, reject)=>{
            if(accountId) {
                const data:any = selfStorage.getItem(accountId);
                if(data && data.addresses){
                    if(selfStorage.getItem("sero_address")){
                        data.addresses[ChainType.SERO]=selfStorage.getItem("sero_address")
                    }
                    if(selfStorage.getItem("bsc_address")){
                        data.addresses[ChainType.BSC]=selfStorage.getItem("bsc_address")
                    }
                    if(selfStorage.getItem("eth_address")){
                        data.addresses[ChainType.ETH]=selfStorage.getItem("eth_address")
                    }
                    if(selfStorage.getItem("tron_address")){
                        data.addresses[ChainType.TRON]=selfStorage.getItem("tron_address")
                    }
                    resolve(data)
                }else{
                    service.accountInfo(accountId,function (data:any){
                        if(data.error){
                            console.log(data.error);
                            reject(data.error)
                        }else{
                            const tmp:any = data.result;
                            resolve(tmp)
                            selfStorage.setItem(accountId,tmp)
                        }
                    })
                }
                service.accountInfo(accountId,function (data:any){
                    if(data.error){
                        console.log(data.error);
                        if(data.error.indexOf("unlock") > -1){
                            // url.accountUnlock();
                        }
                    }else{
                        const tmp:any = data.result;
                        selfStorage.setItem(accountId,tmp)
                    }
                })
            }else{
                service.accounts(function (accounts:Array<AccountModel>){
                    if(accounts && accounts.length>0){
                        resolve(accounts[0])
                    }else{
                        reject("Account not asset!")
                    }
                })
            }
        })
    }

    async signTx(accountId:string,password:string,chainType:any,params:any,chainParams?:any) :Promise<any> {
        return new Promise((resolve, reject)=>{
            service.signTx(accountId,password,chainType,params,chainParams, function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async genNewWallet(accountId:string,password:string,chainType:ChainType){
        return new Promise((resolve, reject) =>{
            service.genNewWallet({accountId:accountId,password:password,chainType:chainType},function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async unlockWallet(password:string){
        const accountId = selfStorage.getItem("accountId");;
        return new Promise((resolve, reject) =>{
            service.unlockWallet(accountId,password,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async isLocked(){
        return new Promise((resolve, reject) =>{
            service.isLocked(function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async lockWallet(){
        return new Promise((resolve, reject) =>{
            service.lockWallet(function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async personSignMsg(chainType:ChainType,msg:any,accountId:string):Promise<any> {
        return new Promise((resolve, reject) => {
            service.personSignMessage(chainType,msg,accountId,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async signTypedMessage(chainType:ChainType,msg:any,version:string,accountId:string):Promise<any> {
        return new Promise((resolve, reject) => {
            service.signTypedMessage(chainType,msg,version,accountId,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async setBackedUp(accountId:string):Promise<any> {
        return new Promise((resolve, reject) => {
            service.setBackedUp(accountId,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }


    async removeAccount(accountId:string,password:string) :Promise<any> {
        return new Promise((resolve, reject) => {
            service.removeAccount(accountId,password,function (data:any){
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

}

const walletWorker = new WalletWorker();
export default walletWorker