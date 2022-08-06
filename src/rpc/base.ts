import axios from "axios";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
class Base {
    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    req = async (url: string, data: any) => {
        const resp = await axios.post(this.host, data)
        return resp.data;
    }

    async post(method: any, params: any, chain?: ChainType, path?: string) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        if (chain) {
            axios.defaults.headers.post['chain'] = chain;
        }
        return new Promise((resolve, reject) => {
            const host = path ? this.host + path : this.host;
            axios.post(host, data).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                console.error("rpc post err: ", e)
                reject(e)
            })
        })
    }
}

export default Base