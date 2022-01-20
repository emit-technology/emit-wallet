import {PANCAKE_SWAP_CONFIG} from "../../config";

class Router {

    getPath = (fromToken: string, toToken: string) => {
        const tokens: any = PANCAKE_SWAP_CONFIG.TOKENS;
        const swapInfo = tokens[fromToken];
        const path: Array<string> = [];
        if (swapInfo) {
            path.push(swapInfo.ADDRESS)
            const swapArr: Array<string> = swapInfo.SWAP;
            if (swapArr.indexOf(toToken) > -1) {
                path.push(tokens[toToken].ADDRESS)
            }else{
                for(let t of swapArr){
                    const tArr: Array<string> = tokens[t].SWAP;
                    if(tArr.indexOf(toToken)>-1){
                        path.push(tokens[t].ADDRESS)
                    }
                }
                path.push(tokens[toToken].ADDRESS)
            }
        }
        console.log("getRouters:: ",fromToken,toToken,path);
        return path
    }

    getTokenAddress = (token:string)=>{
        const tokens:any = PANCAKE_SWAP_CONFIG.TOKENS;
        return tokens[token].ADDRESS;
    }

    getToTokens = (fromToken:string):Array<string> =>{
        const tokens:any = PANCAKE_SWAP_CONFIG.TOKENS;
        return tokens[fromToken].TO;
    }

    getTokens = () =>{
        return Object.keys(PANCAKE_SWAP_CONFIG.TOKENS)
    }
}

const router = new Router()
export default router